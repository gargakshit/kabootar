package web

import (
	"log/slog"
	"time"

	"github.com/gargakshit/kabootar/config"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
)

func InitWeb(cfg *config.Config) error {
	app := fiber.New()
	app.Use(recover.New())

	if cfg.CorsEndpoint != "" {
		app.Use(cors.New(cors.Config{AllowOrigins: cfg.CorsEndpoint}))
	}

	app.Use(func(c *fiber.Ctx) error {
		t0 := time.Now()
		slog.Info(
			"HTTP request",
			slog.String("path", c.Path()),
			slog.String("method", c.Method()),
			slog.String("remote_addr", c.IP()+":"+c.Port()),
		)

		err := c.Next()

		slog.Info(
			"HTTP response",
			slog.String("path", c.Path()),
			slog.String("method", c.Method()),
			slog.String("remote_addr", c.IP()+":"+c.Port()),
			slog.Duration("time", time.Since(t0)),
			slog.Int("bytes_sent", len(c.Response().Body())),
			slog.Int("status", c.Response().StatusCode()),
		)

		logger.New()

		return err
	})

	rtGroup := app.Group("rt/v1")
	rtGroup.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("Pong!")
	})

	h := newHandler(cfg)
	err := h.InitTurn()
	if err != nil {
		return err
	}

	rtGroup.Post("/room", h.CreateRoom)
	rtGroup.Get("/room", h.GetRoom)
	rtGroup.Get("/ws/:room_id", h.InitializeWS, websocket.New(h.HandleWS))
	rtGroup.Get("/discover", h.ValidateDiscoveryRequest,
		h.InitializeWS, websocket.New(h.HandleDiscovery))

	setupApp(app)

	slog.Info("Starting the HTTP listener", slog.String("address", cfg.ListenAddress))
	return app.Listen(cfg.ListenAddress)
}
