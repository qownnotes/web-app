class SendFilesService {
    send(ws, file) {
        console.log("Send file...");
        console.log(file);
        let reader = new FileReader();

        reader.onerror = () => {
            console.error(reader.error);
        };

        reader.onload = (e) => {
            console.log(e.target.result);
            const data = {
                "token": "123",
                "command": "insertFile",
                "file": e.target.result
            }

            console.log(data);
            // ws.send(data);
            ws.send(JSON.stringify(data));

            // ws.close();
            // TODO: Implement an acknowledge answer from the server for every client message
        }

        reader.readAsDataURL(file);
        // ws.onopen = () => reader.readAsDataURL(file);
    }
}

export default new SendFilesService();