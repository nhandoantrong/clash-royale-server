const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
var cors = require('cors');
const http = require('http')
const socketIO = require('socket.io')

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;
const { mongoURI } = require('./config/keys');


mongoose.connect(mongoURI, { useNewUrlParser: true })
    .then(console.log("connected to db"))
    .catch(console.log);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api/users', require('./routes/api/UserApi'))

const server = http.createServer(app)

//from here is socket handling

const logedUserArr =[];

const checkExistInStringArray =(array,ussername) =>{
  for (let element of array)
  {
    if (element.username=== ussername)
      return true ;
  }
  return false;
}

const getUserSocketID = (array,username) =>{
  for (let element of array)
  {
    if (element.username=== username)
      return element.socketID;
  }
}
const resetSocketId = (array,username,socketID) =>{
  for (let element of array)
  {
    if (element.username=== username)
      return element.socketID =socketID;
  }
}

const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
  
  socket.on("login", (data)=>{
    console.log(`${data.username} logged in`)
    if (!checkExistInStringArray(logedUserArr,data.username))
    {
      logedUserArr.push({username :data.username,socketID: socket.id});
    }
    else{
      resetSocketId(logedUserArr,data.username,socket.id);
    }
  })


  // chalenge handle
  socket.on("chalenge",(data)=>{
    const {from, to} = data;
    const toSocketID = getUserSocketID(logedUserArr,to);
    io.to(`${toSocketID}`).emit("chalenge",{from,to});
  })
  socket.on("chalenge-accepted",(data)=>{
    const {from, to} = data;
    const toSocketID = getUserSocketID(logedUserArr,to);
    io.to(`${toSocketID}`).emit("chalenge-accepted",{from:data.from, to:data.to})
  })
  socket.on("chalenge-denied",(data)=>{
    const {from, to} = data;
    const toSocketID = getUserSocketID(logedUserArr,to);

    io.to(`${toSocketID}`).emit("chalenge-denied",{from:data.from,to:data.to})
  })
  socket.on("initial-castle",(data)=>{
    const {username, enemy} = data
    const toSocketID =getUserSocketID(logedUserArr,enemy);
    io.to(`${toSocketID}`).emit("initial-castle",data);
  })

  socket.on("attack",(data)=>{
    const {to} =data;
    const toSocketID =getUserSocketID(logedUserArr,to);
    io.to(`${toSocketID}`).emit("attack",data);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
  
})

server.listen(port, () => console.log(`Listening on port ${port}`))