package main

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]string

	// Inbound messages from the clients.
	broadcast chan Message

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	connections map[string]*connection
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]string),
		connection: make(map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client.token] = client
		case client := <-h.unregister:
			if _, ok := h.clients[client.token]; ok {
				delete(h.clients, client.token)
				close(client.send)
			}
		case message := <-h.send:
			if client, ok := h.clients[message.ID]; ok {
				select {
				case client.send <- message.data:
				default:
					close(client.send)
					delete(h.connections, client)
				}
			}
		}
	}
}
