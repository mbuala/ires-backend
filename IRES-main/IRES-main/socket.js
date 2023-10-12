const socket_io = require("socket.io")
const io = socket_io();
// const socket_io = new io.Server(server,{
//     cors :{
//         origins : ["*"]
//     }
// })



let Socket = {
    emit : (event, data) => {
        io.sockets.emit(event, data);
    }
};

io.on("connection", (socket) => {
    console.log("a user connected");
});
exports.socketConnection = { "io" : io , "socket" : Socket };