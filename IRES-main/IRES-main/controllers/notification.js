// const app = require('../app');
const socket = require('../app');

// const socket = require('socket.io')(server,{
//     cors: {
//         origin: '*',
//       }
//   });


  
    // socket.emit('notification', 'hello'); // Updates Live Notification
    // Send Notification API
// app.post('/send-notification', (req, res) => {
//   const notify = {data: req.body};
//   socket.emit('notification', notify); // Updates Live Notification
//   res.send('hahah');
// });


   

global.count = 0;

module.exports ={

    sendNotification(req, res) {
      const  data = req.body
      // socket.emit('my broadcast', 'Hello there from node js.');
      // socket.in("_room" + req.body.id).emit("my broadcast", "How are You ?");
      socket.ioObject.emit("my broadcast", "How are You ?");
       res.status(200).json({ data});



}
}

// exports.live = (req, res, next) =>{
//   setInterval(() => {
//     global.count = global.count + 1;
//     socket.socketConnection.emit('count event' , global.count)
//   }, 2000);
// }