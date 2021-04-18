class WebSocketService {
    init() {
        this.readToken();

        if (window.token === "") {
            return;
        }

        this.close();

        // const url = "\"ws://\" + document.location.host + \"/ws\"";
        const url = "ws://localhost:8080/ws/" + window.token;

        window.ws = new WebSocket(url);
        window.ws.onopen = () => {
            console.log("Connected to socket " + url);
        };

        window.ws.onclose = () => {
            console.log("Connection to socket " + url + " closed");
        };

        window.ws.onerror = (e) => {
            console.error(e.msg);
        }

        window.ws.onmessage = (e) => {
            console.log(e.data);
        }
    }

    close() {
        if (window.ws) {
            window.ws.close();
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
}

export default new WebSocketService();
