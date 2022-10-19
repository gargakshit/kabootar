package web

import (
	"github.com/gargakshit/kabootar/signalling/util"
	"github.com/gofiber/websocket/v2"
	"github.com/puzpuzpuz/xsync"
)

type Room struct {
	MKey string
	CKey string

	Master  *websocket.Conn
	Clients *xsync.MapOf[*websocket.Conn]
}

func NewRoom() (*Room, error) {
	mKey, err := util.GenerateRandomString(24)
	if err != nil {
		return nil, err
	}

	cKey, err := util.GenerateRandomString(24)
	if err != nil {
		return nil, err
	}

	return &Room{
		MKey:    mKey,
		CKey:    cKey,
		Master:  nil,
		Clients: xsync.NewMapOf[*websocket.Conn](),
	}, nil
}
