class WebSocketService {
  init() {
    this.readToken();

    if (window.token === "") {
      return;
    }

    this.close();

    // Use localhost directly for development to be able to start
    // a different webserver for the web application
    const url =
      document.location.protocol === "http:"
        ? "ws://localhost:8080/ws/" + window.token
        : "wss://" + document.location.host + "/ws/" + window.token;
    console.log("Connecting to socket " + url);

    window.ws = new WebSocket(url);
    window.ws.onopen = () => {
      console.log("Connected to socket " + url);

      // Send registration with connection name so other devices can identify this client
      const connectionName = this.readConnectionName() || "QOwnNotes Web App";
      window.ws.send(
        JSON.stringify({
          command: "register",
          connectionName: connectionName,
        }),
      );
    };

    window.ws.onclose = () => {
      console.log("Connection to socket " + url + " closed");
      delete window.ws;
    };

    window.ws.onerror = (e) => {
      console.error(e.msg);
    };

    window.ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      console.log("Received message", m);

      switch (m.command) {
        case "showWarning": {
          // Suppress the multiple-devices warning; connected devices are shown in the UI instead
          console.debug("Suppressed server warning:", m.msg);
          break;
        }
        case "confirmInsert": {
          const event = new CustomEvent("insert-confirmed");
          window.dispatchEvent(event);
          break;
        }
        case "connectedDevices": {
          const event = new CustomEvent("connected-devices-updated", {
            detail: m.devices,
          });
          window.dispatchEvent(event);
          break;
        }
      }
    };
  }

  close() {
    if (window.ws) {
      window.ws.close();
      delete window.ws;
    }
  }

  readToken() {
    return (window.token = window.localStorage.getItem("token") || "");
  }

  updateToken(token) {
    token = token.trim();

    if (window.token === token) {
      return;
    }

    window.localStorage.setItem("token", token);
    window.token = token;
    window._paq.push(["trackEvent", "Config", "UpdateToken"]);

    this.init();
  }

  readConnectionName() {
    return window.localStorage.getItem("connectionName") || "";
  }

  updateConnectionName(name) {
    window.localStorage.setItem("connectionName", name.trim());
  }

  isOpen() {
    return window.ws && window.ws.readyState === WebSocket.OPEN;
  }

  requestConnectedDevices() {
    if (!this.isOpen()) {
      return;
    }
    window.ws.send(JSON.stringify({ command: "getConnectedDevices" }));
  }
}

export default new WebSocketService();
