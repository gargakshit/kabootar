package web

import (
	"errors"
	"log/slog"
	"strconv"

	"github.com/gargakshit/kabootar/config"
	"github.com/gargakshit/kabootar/util"
	"github.com/gofiber/websocket/v2"
	"github.com/pion/turn/v2"
	"github.com/puzpuzpuz/xsync"
)

type handler struct {
	rooms            *xsync.MapOf[string, *Room]
	discoverable     *xsync.MapOf[string, map[*Room]struct{}]
	discoveryClients *xsync.MapOf[string, map[*websocket.Conn]struct{}]
	cfg              *config.Config
	turnServer       *turn.Server
	turnURL          string
}

func newHandler(cfg *config.Config) *handler {
	return &handler{
		rooms:            xsync.NewMapOf[*Room](),
		discoverable:     xsync.NewMapOf[map[*Room]struct{}](),
		discoveryClients: xsync.NewMapOf[map[*websocket.Conn]struct{}](),
		cfg:              cfg,
		turnURL:          cfg.TurnRealm + ":" + strconv.Itoa(cfg.TurnPort),
	}
}

func (h *handler) newRoom() (string, *Room, error) {
	roomID, err := util.GenerateRandomString(12)
	if err != nil {
		return "", nil, err
	}

	room, err := NewRoom(roomID, h.cfg.TurnRealm)
	if err != nil {
		return "", nil, err
	}

	h.rooms.Store(roomID, room)
	return roomID, room, nil
}

func (h *handler) makeDiscoverable(ip string, room *Room) {
	slog.Info("Making room discoverable", slog.String("ip", ip), slog.String("room", room.ID))

	rooms, ok := h.discoverable.Load(ip)
	if !ok {
		rooms = make(map[*Room]struct{})
		h.discoverable.Store(ip, rooms)
	}

	rooms[room] = struct{}{}
	room.DiscoveryIP = ip
	h.notifyDiscoveryClients(ip, true, room)
}

func (h *handler) registerDiscoveryClient(ip string, conn *websocket.Conn) {
	slog.Info("Registering discovery client", slog.String("ip", ip))

	clients, ok := h.discoveryClients.Load(ip)
	if !ok {
		clients = make(map[*websocket.Conn]struct{})
		h.discoveryClients.Store(ip, clients)
	}

	clients[conn] = struct{}{}

	rooms, ok := h.discoverable.Load(ip)
	if !ok {
		return
	}

	for room := range rooms {
		conn.WriteJSON([]string{"0", room.ID, room.Name, room.Emoji})
	}
}

func (h *handler) unregisterDiscoveryClient(ip string, conn *websocket.Conn) {
	slog.Info("Unregistering discovery client", slog.String("ip", ip))

	clients, ok := h.discoveryClients.Load(ip)
	if !ok {
		return
	}

	delete(clients, conn)
}

func (h *handler) notifyDiscoveryClients(ip string, added bool, room *Room) {
	slog.Info(
		"Notifying discovery clients",
		slog.String("ip", ip),
		slog.String("room", room.ID),
		slog.Bool("added", added),
	)

	clients, ok := h.discoveryClients.Load(ip)
	if !ok {
		return
	}

	var payload []string
	if added {
		payload = []string{"0", room.ID, room.Name, room.Emoji}
	} else {
		payload = []string{"1", room.ID}
	}

	for client := range clients {
		client.WriteJSON(payload)
	}
}

func (h *handler) getRoom(id string) (*Room, bool) {
	return h.rooms.Load(id)
}

func (h *handler) joinRoom(
	roomID,
	key string,
	isMaster bool,
	conn *websocket.Conn,
) (bool, string) {
	slog.Info(
		"Room join request",
		slog.String("room", roomID),
		slog.Bool("is_master", isMaster),
	)

	if key == "" {
		slog.Debug(
			"Rejecting room join request",
			slog.String("room", roomID),
			slog.Bool("is_master", isMaster),
			slog.String("reason", "empty key"),
		)
		return false, ""
	}

	room, exists := h.getRoom(roomID)
	if !exists {
		slog.Debug(
			"Rejecting room join request",
			slog.String("room", roomID),
			slog.Bool("is_master", isMaster),
			slog.String("reason", "room doesn't exist"),
		)
		return false, ""
	}

	if isMaster {
		if room.MKey != key {
			slog.Debug(
				"Rejecting room join request",
				slog.String("room", roomID),
				slog.Bool("is_master", isMaster),
				slog.String("reason", "invalid master key"),
			)
			return false, ""
		}

		if room.Master != nil {
			slog.Debug(
				"Rejecting room join request",
				slog.String("room", roomID),
				slog.Bool("is_master", isMaster),
				slog.String("reason", "duplicate master"),
			)
			return false, ""
		}

		room.Master = conn
		return true, ""
	}

	if room.CKey != key {
		slog.Debug(
			"Rejecting room join request",
			slog.String("room", roomID),
			slog.Bool("is_master", isMaster),
			slog.String("reason", "invalid client key"),
		)
		return false, ""
	}

	if room.Master == nil {
		slog.Debug(
			"Rejecting room join request",
			slog.String("room", roomID),
			slog.Bool("is_master", isMaster),
			slog.String("reason", "no room master"),
		)
		return false, ""
	}

	clientID, err := util.GenerateRandomString(8)
	if err != nil {
		slog.Error(
			"Rejecting room join request",
			slog.String("room", roomID),
			slog.Bool("is_master", isMaster),
			slog.String("err", err.Error()),
			slog.String("reason", "client id generation failed"),
		)
		return false, ""
	}

	msg, err := MarshalSMsg(&ProtoSMJoinedPayload{ClientID: clientID})
	if err != nil {
		slog.Error(
			"Rejecting room join request",
			slog.String("room", roomID),
			slog.Bool("is_master", isMaster),
			slog.String("err", err.Error()),
			slog.String("reason", "protocol message marshal failed"),
		)
		return false, ""
	}

	err = room.Master.WriteMessage(1, msg)
	if err != nil {
		slog.Error(
			"Rejecting room join request",
			slog.String("room", roomID),
			slog.Bool("is_master", isMaster),
			slog.String("err", err.Error()),
			slog.String("reason", "connection write failed"),
		)
		return false, ""
	}

	room.Clients.Store(clientID, conn)
	return true, clientID
}

func (h *handler) leaveRoom(
	roomID,
	clientID string,
	isMaster bool,
) {
	slog.Info(
		"Leaving room",
		slog.String("room", roomID),
		slog.String("client_id", clientID),
		slog.Bool("is_master", isMaster),
	)

	room, exists := h.getRoom(roomID)
	if !exists {
		return
	}

	if isMaster {
		room.Clients.Range(func(_ string, c *websocket.Conn) bool {
			msg, err := MarshalSMsg(&ProtoSCGonePayload{})
			if err != nil {
				return false
			}

			c.WriteMessage(1, msg)
			c.Close()
			return true
		})

		h.rooms.Delete(roomID)

		rooms, ok := h.discoverable.Load(room.DiscoveryIP)
		if ok {
			_, ok := rooms[room]
			if ok {
				delete(rooms, room)
				h.notifyDiscoveryClients(room.DiscoveryIP, false, room)
			}
		}
	} else {
		room.Clients.Delete(clientID)

		msg, err := MarshalSMsg(&ProtoSMLeftPayload{ClientID: clientID})
		if err != nil {
			return
		}

		room.Master.WriteMessage(1, msg)
	}
}

func (h *handler) handleMsg(
	roomID,
	clientID string,
	payload []byte,
	isMaster bool,
) error {
	slog.Info(
		"Handling protocol payload",
		slog.String("room", roomID),
		slog.String("client_id", clientID),
		slog.Bool("is_master", isMaster),
	)

	room, exists := h.getRoom(roomID)
	if !exists {
		return errors.New("invalid room")
	}

	msg, err := UnmarshalPMsg(payload, isMaster)
	if err != nil {
		return err
	}

	switch msg := msg.(type) {
	case *ProtoCSMsgPayload:
		m, err := MarshalSMsg(&ProtoSMMsgPayload{Msg: msg.Msg, ClientID: clientID})
		if err != nil {
			return err
		}

		return room.Master.WriteMessage(1, m)

	case *ProtoMSMsgPayload:
		m, err := MarshalSMsg(&ProtoSCMsgPayload{Msg: msg.Msg})
		if err != nil {
			return err
		}

		client, exists := room.Clients.Load(msg.ClientID)
		if !exists {
			return errors.New("client does not exist")
		}

		return client.WriteMessage(1, m)
	default:
		return errors.New("invalid payload")
	}
}
