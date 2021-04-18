class WebSocketService {
    init() {
        this.readToken();

        if (window.token === "") {
            return;
        }

        this.close();

        // Use localhost directly for development to be able to start
        // a different webserver for the web application
        const url = document.location.protocol === "http:" ?
            "ws://localhost:8080/ws/" + window.token :
            "wss://" + document.location.host + "/ws";
        console.log("Connecting to socket " + url);

        window.ws = new WebSocket(url);
        window.ws.onopen = () => {
            console.log("Connected to socket " + url);
        };

        window.ws.onclose = () => {
            console.log("Connection to socket " + url + " closed");
            delete window.ws;
        };

        window.ws.onerror = (e) => {
            console.error(e.msg);
        }

        window.ws.onmessage = (e) => {
            console.log("Received: " + e.data);
        }
    }

    close() {
        if (window.ws) {
            window.ws.close();
            delete window.ws;
        }
    }

    readToken() {
        return window.token = window.localStorage.getItem("token") || "";
    }

    updateToken(token) {
        token = token.trim();

        if (window.token === token) {
            return;
        }

        window.localStorage.setItem("token", token);
        window.token = token;

        this.init();
    }

    isOpen() {
        return window.ws && window.ws.readyState === WebSocket.OPEN;
    }
}

export default new WebSocketService();
