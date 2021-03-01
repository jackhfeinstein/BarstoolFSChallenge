//imports
import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose, {mongo} from 'mongoose';
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from 'cors';

//connecting to .env file
dotenv.config();

//creating the app from express
const app: Application = express();

//import routes
const gamesRoute = require('./routes/games');

//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/games', gamesRoute);

//connect to DB
mongoose.connect(<string> process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true}, (err) => {
    //log error to console if there is one and exit
    if (err) {
        console.log(err);
        process.exit(1);
    }
    //if the connection state is not true log to console and exit
    else if(!mongoose.connection.readyState) {
        console.log("issue connecting to DB")
        process.exit(1);
    }
    //otherwise log to console that you are connected
    else {
        console.log("connected to DB!");
    }
});

//start listening to server and log to console that it is sunning
app.listen(5000, () => console.log('server running on port 5000!'));