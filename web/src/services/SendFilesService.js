import WebSocketService from "@/services/WebSocketService";

class SendFilesService {
    send(file, retry = 0) {
        if (!window.ws) {
            WebSocketService.init();
        }

        if (!WebSocketService.isOpen()) {
            // try a maximum of 5 times to connect
            if (retry < 5) {
                setTimeout(() => { this.send(file, retry++) }, 1000);
            }

            return;
        }

        // console.log("Send data...");
        // console.log(file);
        // window.ws.send("My data");

        console.log("Send file", file);
        // https://matomo.org/docs/event-tracking/
        window._paq.push(['trackEvent', 'File', 'SendFile', 'Size', file.size]);
        let reader = new FileReader();

        reader.onerror = () => {
            console.error("Reader error", reader.error);
        };

        reader.onload = (e) => {
            console.log(e.target.result);
            const data = {
                "command": "insertFile",
                "file": e.target.result,
                "size": file.size,
                "name": file.name
            }

            window.ws.send(JSON.stringify(data));
        }

        reader.readAsDataURL(file);
    }
}

export default new SendFilesService();
