package web

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func (h *handler) InitializeWS(c *fiber.Ctx) error {
	if websocket.IsWebSocketUpgrade(c) {
		return c.Next()
	}

	return c.Status(400).SendString("Plain HTTP request sent to WebSocket endpoint")
}

func (h *handler) HandleWS(c *websocket.Conn) {
	roomID := c.Params("room_id")

	key := c.Query("k", "")
	isMaster := c.Query("m", "f") == "t"

	canJoin, clientID := h.joinRoom(roomID, key, isMaster, c)
	if !canJoin {
		c.Close()
		return
	}

	defer h.leaveRoom(roomID, clientID, isMaster)

	for {
		_, payload, err := c.ReadMessage()
		if err != nil {
			log.Println("Error", err)
			return
		}

		err = h.handleMsg(roomID, clientID, payload, isMaster)
		if err != nil {
			log.Println("Error", err)
			return
		}
	}
}
