package main

import (
	"flag"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()
	r := mux.NewRouter()
	go h.run()

	// Handle websocket
	// This handler needs to be first so that the PathPrefix isn't blocking it
	r.HandleFunc("/ws/{room:[0-9a-z]+}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		room := vars["room"]
		serveWs(w, r, room)
	})

	// Handle static files (web page)
	fs := http.FileServer(http.Dir("web/dist"))
	r.PathPrefix("/").Handler(fs)

	err := http.ListenAndServe(*addr, r)

	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
