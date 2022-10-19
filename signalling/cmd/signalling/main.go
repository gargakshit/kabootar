package main

import (
	"fmt"

	"github.com/gargakshit/kabootar/signalling/web"
)

func main() {
	address := "0.0.0.0:5000"
	fmt.Println("Starting the server on", address)

	err := web.InitWeb(address)
	if err != nil {
		panic(err)
	}
}
