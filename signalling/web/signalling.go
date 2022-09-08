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

	h.addClient(roomID, c)
	defer h.removeClient(roomID, c)

	log.Println("Got a connection on room ID", roomID)

	for {
		_, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("Error", err)
			return
		}

		h.broadcast(roomID, c, msg)
	}
}
