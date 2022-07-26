import express from "express";
import {createServer} from 'http';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import bodyParser from 'body-parser';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (request, response) => {
    response.send('API is up!');
});

app.post('/api/users', usersController.register);

io.on('connection', () => {
   console.log('connect');
});

mongoose.connect('mongodb://localhost:27017/eltrello')
    .then(() => {
        console.log('MongoDB connection established!');
    }).catch((err) => {
        console.log('Mongo Connection Error: ', err);
});

httpServer.listen(4001, () => {
    console.log('API is listening on port 4001');
});
