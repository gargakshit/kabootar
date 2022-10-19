package web

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

func (h *handler) CreateRoom(c *fiber.Ctx) error {
	roomID, room, err := h.newRoom()
	if err != nil {
		log.Println("Error creating room:", err)
		return c.SendStatus(500)
	}

	return c.JSON([]string{roomID, room.MKey, room.CKey})
}
