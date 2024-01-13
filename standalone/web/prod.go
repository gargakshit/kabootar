//go:build prod

package web

import (
	"embed"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
)

//go:embed static
var files embed.FS

func setupApp(app *fiber.App) {
	app.Use("/", filesystem.New(filesystem.Config{
		Root:         http.FS(files),
		PathPrefix:   "static",
		NotFoundFile: "static/index.html",
		Index:        "index.html",
		MaxAge:       60 * 60, // 1 hour
	}))
}
