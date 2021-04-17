class SendFilesService {
    send(file) {
        // const ws = new WebSocket("ws://" + document.location.host + "/ws");
        const ws = new WebSocket("ws://localhost:8080/ws");
        ws.binaryType = "arrayBuffer";
        const reader = new FileReader();
        let rawData = new ArrayBuffer();

        reader.loadend = function() {
        }

        reader.onload = async (e) => {
            rawData = e.target.result;
            await ws.send(rawData);
            // alert("the File has been transferred.");

            // ws.close();
            // TODO: Implement an acknowledge answer from the server for every client message
        }

        ws.onopen = () => reader.readAsArrayBuffer(file);
    }
}

export default new SendFilesService();
