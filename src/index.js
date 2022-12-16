const express =  require('express');
const path = require("path")
const app = express();
const httpServer = require('http').createServer(app);
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const {registerUser, loginUser, addResults, leaderBoard} = require("./database.js");
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

//Global server-side variables
let clients = {};
let clientCount = 0;
let gameState = {};
let ROOM_SIZE = 2;
let NUM_ROUNDS = 5;
let NUM_LIVES = Math.floor(NUM_ROUNDS / 2) + 1;
let BASE_TIMER = 5000;
let TIMER_RANGE = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// app.set("views", path.resolve(__dirname, "..") + "\\public\\views");
// app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/info", (req, res) => {
    res.redirect("/views/info.html")
});

app.get("/login", (req, res) => {
    res.redirect("/views/login.html")
});

app.post("/processLogin", async (req, res) => {
    const [result , message] = await loginUser(req.body);
    
    if(result){
        res.status(200).json({"status":true,"user":req.body.user})
    }else{
        res.status(200).json({"status":false, "message": message}) 
    }
});

app.get("/register", (req, res) => {
    res.redirect("/views/register.html")
});

app.post("/processRegister", async (req, res) => {
    const [result, message] = await registerUser(req.body);

    if(result){
        res.status(200).json({"status":true,"user":req.body.user})
    }else{
        res.status(200).json({"status":false, "message":message}) 
    }
});

app.get("/leaderboard", async (req, res) => {
    const board = await leaderBoard();
    const result = (await board.toArray()).map((entry) => {
        return {
            "user":entry['user'],
            "wins":entry['wins'],
            "loses":entry['loses'],
            'total':entry['total games']
        }
    });

    console.log("----------------", result);

    res.send(result);
})

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


            if([...rooms.get(currRoom)].length < ROOM_SIZE){
                socket.join(currRoom);
                clientRoom = currRoom;
                clients[socket.id]['room'] = currRoom;
                foundRoom = true;
            }
            
        }
        
        if(!foundRoom){

            clientRoom = "room-" + guid();
            socket.join(clientRoom);
            clients[socket.id]['room'] = clientRoom;
        }
        
        if(foundRoom){

            // console.log("Current Socket: ", socket.id)
            // console.log("Found Room! ", [...rooms.get(clientRoom)]);

            let sockets = [...rooms.get(clientRoom)];
            let payload = {};
            let player1 = {};
            let player2 = {};

          
            player1['clientID'] = clients[sockets[0]]['clientID'];
            player1['username'] = clients[sockets[0]]['username'];
            player1['lives'] = NUM_LIVES;

            player2['clientID'] = clients[sockets[1]]['clientID'];
            player2['username'] = clients[sockets[1]]['username'];
            player2['lives'] = NUM_LIVES;


            payload["player1"] = player1;
            payload["player2"] = player2;


            // console.log("Current Socket: ",socket.id);
            // console.log("Payload: ", payload);

            gameState[clientRoom] = {
                "interval" : Math.floor(Math.random() * TIMER_RANGE) + BASE_TIMER,
                "player1" : player1,
                "player2" : player2,
                "started" : false,
                "roundWinner" : "",
                "totalRounds" : NUM_ROUNDS,
                "currRound" : 1
            }

            io.to(clientRoom).emit("foundRoom", gameState[clientRoom]);            
        }
        
    })

    //Clean-up / server-side logic
    socket.on("gameReady", () => {
        const currGame = clients[socket.id]["room"];
        const started = gameState[currGame]["started"];
        const timer = gameState[currGame]["interval"];

        // console.log("Curr Client: ",clients[socket.id]);
        // console.log("Curr Client Room: ",clients[socket.id]["room"])
        // console.log("GameState: ", gameState[clients[socket.id]["room"]]);
        // console.log("Timer: ", gameState[clients[socket.id]["room"]]["interval"]);

        if (!started) {

            gameState[currGame]["started"] = true;

            setTimeout(() => {

                io.to(currGame).emit("startGame", "Shoot Now! Timer: " + timer);

            }, timer);

        }
    });

    socket.on("shoot", () => {
        const currGame = clients[socket.id]["room"];
        let roundWinner = gameState[currGame]["roundWinner"];

        
        if(roundWinner === ""){
            const username = clients[socket.id]["username"]
            let otherPlayer = "";


            console.log("Player: " + username + "#" + clientID + " Sent shot");
            roundWinner = username + "#" +clientID;
            gameState[currGame]["roundWinner"] = clientID;
            
            if(gameState[currGame]["player1"]["clientID"] === clientID)
                otherPlayer = "player2"
        
            else
                otherPlayer = "player1"
            
            
            if(gameState[currGame][otherPlayer]["lives"] !== 1){

                gameState[currGame][otherPlayer]['lives'] -= 1;
                io.to(currGame).emit("roundWinner", gameState[currGame]);
            
            }
            
            else{
            
                io.to(currGame).emit("gameWinner",username + "#" + clientID)
                addResults(username,true);
                addResults( gameState[currGame][otherPlayer]["username"],false);
            }
            
        }
    });

    socket.on("nextRound", () => {
        const currRoom = clients[socket.id]['room'];
        
        console.log("Before ClientID: " + clientID + " started: " + gameState[currRoom]["started"]);
        console.log("Before ClientID: " + clientID + " currRound: " + gameState[currRoom]["currRound"]);

        if(gameState[currRoom]["started"]){
            gameState[currRoom]["started"] = false;

            
            gameState[currRoom]["interval"] = Math.floor(Math.random() * TIMER_RANGE) + BASE_TIMER;
            gameState[currRoom]["currRound"] += 1;
            gameState[currRoom]["roundWinner"] = "";
            
        }

        console.log("After ClientID: " + clientID + " started: " + gameState[currRoom]["started"]);
        console.log("After ClientID: " + clientID + " currRound: " + gameState[currRoom]["currRound"]);
        console.log("Curr Room: ",gameState[currRoom]);

        io.to(currRoom).emit("continue", gameState[currRoom]);
    });
    
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
