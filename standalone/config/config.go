package config

import (
	"github.com/BurntSushi/toml"
)

type Config struct {
	ListenAddress string `toml:"listen_address"`
	CorsEndpoint  string `toml:"cors_endpoint"`
	TurnRealm     string `toml:"turn_realm"`
	TurnListenIP  string `toml:"turn_listen_ip"`
	PublicIP      string `toml:"public_ip"`
	TurnPort      int    `toml:"turn_port"`
}

func NewConfigFromString(data string) (*Config, error) {
	config := &Config{}
	_, err := toml.Decode(data, config)

	return config, err
}

func NewConfig(filePath string) (*Config, error) {
	config := &Config{}
	_, err := toml.DecodeFile(filePath, config)

	return config, err
}
