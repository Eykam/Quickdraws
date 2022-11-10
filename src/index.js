const express =  require('express');
const app = express();
const http = require("http");
const { getuid } = require('process');
const httpServer = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

//Global server-side variables
let clients = {};
let clientCount = 0;

app.use(express.static("public"));

io.on("connection", (socket) => {
    
    //Variables for each user connecting
    const clientID = clientCount++;

    //Initial emits when new user connects
    socket.emit("clientID", clientID);
    
    clients[socket.id] = {
        "clientID" : clientID,
        "username" : "",
        "room" : ""
    }

    //Server-side console logs
    console.log("User " + clientID + " connected!");
    console.log("Current clients: ", clients);

    //Server messages
    socket.on("disconnect", () => {
        console.log("Room to leave: ",clients[socket.id]['room'])
        socket.emit("leftGame");
        io.socketsLeave(clients[socket.id]['room']);
        console.log("User disconnected: ", clientID);
        delete clients[socket.id];
    })

    socket.on("joinRoom", (data) => {
        
        //Check to see if any rooms without 2 players
        //if there isnt then create a room
        //Otherwise find room ID and join
        let rooms = io.sockets.adapter.rooms;
        let roomIDs = [...rooms.keys()];
        let foundRoom = false;
        let clientRoom = "";
        
        clients[socket.id]['username'] = data;
        
        for (let x = 0; x < roomIDs.length; x++){
            let currRoom = roomIDs[x];

            if(!currRoom.includes("room"))
                continue;


            if([...rooms.get(currRoom)].length < 2){
                socket.join(currRoom);
                clientRoom = currRoom;
                clients[socket.id]['room'] = currRoom;
                foundRoom = true;
            }
            
        }
        
        if(!foundRoom){
            socket.join("room-" + guid());
            clientRoom = "room-" + guid();
        }
        
        if(foundRoom){
            console.log("Current Socket: ", socket.id)
            console.log("Found Room! ", [...rooms.get(clientRoom)]);
            let sockets = [...rooms.get(clientRoom)];
            let payload = {};
            let player1 = {};
            let player2 = {};

          
            player1['clientID'] = clients[sockets[0]]['clientID'];
            player1['username'] = clients[sockets[0]]['username'];

            player2['clientID'] = clients[sockets[1]]['clientID'];
            player2['username'] = clients[sockets[1]]['username'];


            payload["player1"] = player1;
            payload["player2"] = player2;


            console.log("Current Socket: ",socket.id);
            console.log("Payload: ", payload);
            
            io.to(clientRoom).emit("foundRoom", payload);
        }
    })

    //Clean-up / server-side logic
    // setInterval(()=> {
    //     console.log("Clients: ",clients);
    //     console.log("Rooms: ", io.sockets.adapter.rooms)
    // },5000)
    
});


httpServer.listen(PORT, () => {
    console.log("Listening on port: ", PORT);
});

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }