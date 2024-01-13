package web

import (
	"github.com/gargakshit/kabootar/util"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func (h *handler) ValidateDiscoveryRequest(c *fiber.Ctx) error {
	ip := c.Query("ip")
	if !util.IsIPPublic(ip) {
		return c.SendStatus(400)
	}

	return c.Next()
}

func (h *handler) HandleDiscovery(c *websocket.Conn) {
	ip := c.Query("ip")
	h.registerDiscoveryClient(ip, c)
	defer h.unregisterDiscoveryClient(ip, c)

	for {
		_, _, err := c.ReadMessage()
		if err != nil {
			return
		}
	}
}

func (h *handler) GetRoom(c *fiber.Ctx) error {
	id := c.Query("id", "")
	if id == "" {
		return c.SendStatus(400)
	}

	pin := c.Query("pin", "")
	if pin == "" {
		return c.SendStatus(400)
	}

	room, ok := h.rooms.Load(id)
	if !ok {
		return c.SendStatus(401)
	}

	if room.PIN != pin {
		return c.SendStatus(401)
	}

	return c.JSON([]string{room.CKey})
}
