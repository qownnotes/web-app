package main

import (
	"encoding/json"
	"log"
)

type message struct {
	data   []byte
	room   string
	sender *connection
}

type subscription struct {
	conn *connection
	room string
}

// hub maintains the set of active connections and broadcasts messages to the
// connections.
type hub struct {
	// Registered connections.
	rooms map[string]map[*connection]bool

	// Connection names keyed by connection pointer.
	connectionNames map[*connection]string

	// Inbound messages from the connections.
	broadcast chan message

	// Register requests from the connections.
	register chan subscription

	// Unregister requests from connections.
	unregister chan subscription
}

var h = hub{
	broadcast:       make(chan message),
	register:        make(chan subscription),
	unregister:      make(chan subscription),
	rooms:           make(map[string]map[*connection]bool),
	connectionNames: make(map[*connection]string),
}

// incomingMessage represents a parsed message from a client.
type incomingMessage struct {
	Command        string `json:"command"`
	ConnectionName string `json:"connectionName"`
}

func (h *hub) run() {
	for {
		select {
		case s := <-h.register:
			connections := h.rooms[s.room]
			if connections == nil {
				connections = make(map[*connection]bool)
				h.rooms[s.room] = connections
			}
			h.rooms[s.room][s.conn] = true

			log.Printf("Registered room: %s", s.room)

		case s := <-h.unregister:
			connections := h.rooms[s.room]
			if connections != nil {
				if _, ok := connections[s.conn]; ok {
					delete(connections, s.conn)
					delete(h.connectionNames, s.conn)
					close(s.conn.send)
					if len(connections) == 0 {
						delete(h.rooms, s.room)
					}
				}
			}
		case m := <-h.broadcast:
			// Check if this is a control command that the hub should handle directly
			var msg incomingMessage
			if err := json.Unmarshal(m.data, &msg); err == nil {
				if msg.Command == "register" {
					// Store the connection name for this sender
					if msg.ConnectionName != "" {
						h.connectionNames[m.sender] = msg.ConnectionName
						log.Printf("Registered connection name '%s' in room %s", msg.ConnectionName, m.room)
					}
					// Don't relay register messages to other clients
					continue
				} else if msg.Command == "getConnectedDevices" {
					// Collect names of all connections in the room
					connections := h.rooms[m.room]
					var names []string
					for c := range connections {
						if name, ok := h.connectionNames[c]; ok && name != "" {
							names = append(names, name)
						}
					}

					// Build response and send only to the requester
					type devicesResponse struct {
						Command string   `json:"command"`
						Devices []string `json:"devices"`
					}
					resp := devicesResponse{Command: "connectedDevices", Devices: names}
					if names == nil {
						resp.Devices = []string{}
					}
					data, err := json.Marshal(resp)
					if err == nil {
						select {
						case m.sender.send <- data:
						default:
							close(m.sender.send)
							delete(connections, m.sender)
						}
					}
					continue
				}
			}

			sendMessage(m)
		}
	}
}

func sendMessage(m message) {
	connections := h.rooms[m.room]
	for c := range connections {
		// Don't send sender the message back
		if c == m.sender {
			continue
		}

		select {
		case c.send <- m.data:
		default:
			close(c.send)
			delete(connections, c)
			if len(connections) == 0 {
				delete(h.rooms, m.room)
			}
		}
	}
}
