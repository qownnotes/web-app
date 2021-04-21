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
            "wss://" + document.location.host + "/ws/" + window.token;
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
            const m = JSON.parse(e.data);
            console.log("Received message", m);

            switch (m.command) {
                case "showWarning": {
                    const event = new CustomEvent("warning", { detail: m.msg });
                    window.dispatchEvent(event);
                    break;
                }
                case "confirmInsert": {
                    const event = new CustomEvent("insert-confirmed");
                    window.dispatchEvent(event);
                    break;
                }
            }
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
        window._paq.push(['trackEvent', 'Config', 'UpdateToken']);

        this.init();
    }

    isOpen() {
        return window.ws && window.ws.readyState === WebSocket.OPEN;
    }
}

export default new WebSocketService();
