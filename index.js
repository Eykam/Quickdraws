const express =  require('express');
const webSocketServer = require('websocket').server;
const app = express();
const http = require("http");
const httpServer = require('http').createServer();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client.html")
})

app.listen(8001, () =>{
    console.log("Listening on http port 8001")
})

httpServer.listen(8000, () => {
    console.log("Listening on port 8000....");
})


const clients = {};

const wSS = new webSocketServer({
    "httpServer": httpServer
})




wSS.on("request", request => {
    //Connecting to websocket server
    const connection = request.accept(null,request.origin);

    connection.on("open", () => console.log("Connection Opened"))

    connection.on("close", () => console.log("Connection Closed"))
    connection.on("message", message => {
        //const result = JSON.parse(message.utf8Data)
        console.log("Server message: ", message.utf8Data);
    })

    //New client ID
    const clientID = guid();

    clients[clientID] = {
        "connection" : connection
    };

    const payload = {
        "method": "connect",
        "clientID": clientID
    }

    connection.send(JSON.stringify(payload))
})








function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

const guid = () =>{ 
    const delim = "-";
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
}

