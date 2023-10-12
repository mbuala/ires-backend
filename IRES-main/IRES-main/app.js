const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const bodyParser = require('body-parser');
var fileExtension = require('file-extension')
const multer = require('multer');
const Sequelize = require('sequelize');
const notify = require('./controllers/notify');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// const pg = require('pg-promise/typescript/pg-subset');

const port = 3000;
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const server = app.listen(port, () => {
  console.log(`Server connection on  http://127.0.0.1:${port}`);  // Server Connnected
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

/*
const socket = require('socket.io')(server,{
  cors: {
      origin: '*',
    }
});

let Notifications = {};
const pg = require('pg');
let client = new pg.Client({user: 'postgres', database: 'ires_bdd', host: 'localhost', password: 'azerty123+', port: 5432});
client.connect();
client.query('LISTEN new_event');
client.on('notification', function(data) {
  //  console.log('notification: ', data);
    Notifications = [data.payload] ;
    notify.Notification(Notifications)
    // console.log(Notifications);
});

const socketIoObject = socket;



module.exports.ioObject = socketIoObject;*/