package util

import (
	"net"
)

// IsIPPublic checks if the provided IP is public or not
func IsIPPublic(ip string) bool {
	parsedIP := net.ParseIP(ip)
	if parsedIP == nil {
		return false
	}

	return !parsedIP.IsPrivate()
}
