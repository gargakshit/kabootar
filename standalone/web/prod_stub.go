//go:build !prod

package web

import (
	"github.com/gofiber/fiber/v2"
)

func setupApp(app *fiber.App) {}
