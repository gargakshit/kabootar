package web

import (
	"github.com/gargakshit/kabootar/signalling/util"
	"github.com/gofiber/websocket/v2"
	"github.com/pion/turn/v2"
	"github.com/puzpuzpuz/xsync"
)

type Room struct {
	ID string

	MKey string
	CKey string
	TKey []byte

	PIN         string
	DiscoveryIP string
	Name        string
	Emoji       string

	Master  *websocket.Conn
	Clients *xsync.MapOf[*websocket.Conn]
}

func NewRoom(id, realm string) (*Room, error) {
	mKey, err := util.GenerateRandomString(24)
	if err != nil {
		return nil, err
	}

	cKey, err := util.GenerateRandomString(24)
	if err != nil {
		return nil, err
	}

	turnKey := turn.GenerateAuthKey(id, realm, cKey)

	pin, err := util.GeneratePIN()
	if err != nil {
		return nil, err
	}

	return &Room{
		ID:      id,
		MKey:    mKey,
		CKey:    cKey,
		TKey:    turnKey,
		PIN:     pin,
		Name:    util.GenerateRandomWord() + " " + util.GenerateRandomWord(),
		Emoji:   util.GenerateRandomEmoji(),
		Master:  nil,
		Clients: xsync.NewMapOf[*websocket.Conn](),
	}, nil
}
