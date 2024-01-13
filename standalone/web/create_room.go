package web

import (
	"encoding/json"
	"log"

	"github.com/gargakshit/kabootar/util"
	"github.com/gofiber/fiber/v2"
)

func (h *handler) CreateRoom(c *fiber.Ctx) error {
	var body []string
	err := json.Unmarshal(c.Body(), &body)
	if err != nil {
		return c.SendStatus(400)
	}

	var discoverable bool
	var ip string
	if len(body) == 0 {
		return c.SendStatus(400)
	}

	if body[0] == "t" {
		if len(body) < 2 {
			return c.SendStatus(400)
		}

		ip = body[1]
		discoverable = util.IsIPPublic(ip)
	}

	roomID, room, err := h.newRoom()
	if err != nil {
		log.Println("Error creating room:", err)
		return c.SendStatus(500)
	}

	if discoverable {
		h.makeDiscoverable(ip, room)
	}

	return c.JSON([]string{
		roomID, room.MKey, room.CKey,
		room.Name, room.PIN, room.Emoji,
	})
}
