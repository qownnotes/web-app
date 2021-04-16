package main

import (
	"flag"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()
	hub := newHub()
	go hub.run()

	fs := http.FileServer(http.Dir("web/dist"))
	http.Handle("/", fs)

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	err := http.ListenAndServe(*addr, nil)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
