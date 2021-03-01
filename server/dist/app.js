"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//imports
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv = __importStar(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
//connecting to .env file
dotenv.config();
//creating the app from express
const app = express_1.default();
//import routes
const gamesRoute = require('./routes/games');
//middlewares
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use('/games', gamesRoute);
//connect to DB
mongoose_1.default.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    //log error to console if there is one and exit
    if (err) {
        console.log(err);
        process.exit(1);
    }
    //if the connection state is not true log to console and exit
    else if (!mongoose_1.default.connection.readyState) {
        console.log("issue connecting to DB");
        process.exit(1);
    }
    //otherwise log to console that you are connected
    else {
        console.log("connected to DB!");
    }
});
//start listening to server and log to console that it is sunning
app.listen(5000, () => console.log('server running on port 5000!'));
