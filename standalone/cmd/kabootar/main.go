package main

import (
	"log/slog"
	"os"

	"github.com/gargakshit/kabootar/config"
	"github.com/gargakshit/kabootar/web"
)

func main() {
	level := slog.LevelInfo
	if os.Getenv("KABOOTAR_LOG") == "debug" {
		level = slog.LevelDebug
	}

	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
		AddSource: true,
		Level:     level,
	})))

	var cfg *config.Config
	var err error
	if configEnv := os.Getenv("KABOOTAR_CONFIG"); configEnv != "" {
		cfg, err = config.NewConfigFromString(configEnv)
	} else {
		cfg, err = config.NewConfig("kabootar.toml")
	}

	if err != nil {
		slog.Error("Unable to load kabootar config", slog.String("err", err.Error()))
		os.Exit(2)
	}

	slog.Info("Config loaded", slog.Any("config", cfg))

	err = web.InitWeb(cfg)
	if err != nil {
		slog.Error("Unable to initialize kabootar", slog.String("err", err.Error()))
		os.Exit(2)
	}
}
