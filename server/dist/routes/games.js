"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//imports
const express_1 = require("express");
const Game_1 = __importDefault(require("../models/Game"));
const axios_1 = __importDefault(require("axios"));
//define the maximum number times between calls to barstool api
const MAX_TIME_DIFF = 15000;
//define the router
const router = express_1.Router();
/**
 * Main games request
 * Will find all the games currently cached in the db
 * If updatedAt time is < 15 seconds ago, it will return the cached data
 * Otherwise, it will fetch new data and return that
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //getting all games currently in db
        const games = yield Game_1.default.find({});
        //finding difference in time between when the games in the db were last updated and now
        const timeDiff = Math.abs(new Date().getTime() - games[0].get("updatedAt").getTime());
        //if the time difference is less than the maximum allowed time send the cached data
        if (timeDiff < MAX_TIME_DIFF) {
            console.log("sending cached data");
            res.status(200).send(games);
        }
        //otherwise delete cached data, fetch new data, and return that
        else {
            console.log("sending new data");
            //make delete games request
            const deleted = yield axios_1.default.delete("http://localhost:5000/games/remove");
            //if the delete worked fetch new data and return that
            if (deleted.status === 200) {
                //make the add games request
                const added = yield axios_1.default.get("http://localhost:5000/games/add");
                //if adding games worked return that data
                if (added.status === 200) {
                    //return the new data with a status of 200
                    res.status(200).send(added.data);
                }
                //otherwise return with a status of 500 and log that there was an error
                else {
                    console.log("issue adding new data");
                    res.status(500);
                }
            }
            //otherwise return with a status of 500 and log that there was an error
            else {
                console.log("issue deleting cached data");
                res.status(500);
            }
        }
    }
    //catch any errors along the way
    catch (err) {
        //set status to 500 and send error message
        res.status(500).send({ message: err });
    }
}));
/**
 * Add games post request
 * Will take game objects in request and store them the db
 */
router.post('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //create array to hold all the games
    let savedGames = [];
    try {
        //iterate through all objects in the request
        for (const league of Object.keys(req.body)) {
            //store each game in constant
            const game = new Game_1.default({
                info: req.body[league]
            });
            //save each game in db
            const savedGame = yield game.save();
            //add game to savedGames array
            savedGames.push(savedGame);
        }
        //set status to 200 and return all saved games
        res.status(200).send(savedGames);
    }
    //catch any errors along the way
    catch (err) {
        //set status to 500 and send error message
        res.status(500).send({ message: err });
    }
}));
/**
 * Add games get request
 * Will get most recent data from the barstool api
 * Then store this data by calling the add post request
 */
router.get('/add', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //get nba and mlb data from barstool api
        const nba = yield axios_1.default.get("https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json");
        const mlb = yield axios_1.default.get("https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json");
        //create the response from the data that was gotten
        const response = {
            nbaGame: nba.data,
            mlbGame: mlb.data
        };
        try {
            //make request to add post endpoint with the response that was created
            const postResponse = yield axios_1.default.post("http://localhost:5000/games/add", response);
            //set status to 200 and send the data that was posted
            res.status(200).send(postResponse.data);
        }
        //catch any errors along the way
        catch (err) {
            //set status to 500 and send error message
            res.status(500).send({ message: err });
        }
    }
    //catch any errors along the way
    catch (err) {
        //set status to 500 and send error message
        res.status(500).send({ message: err });
    }
}));
/**
 * Delete games endpoint
 * Will delete all games from the database
 */
router.delete('/remove', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //delete all games in the db
        yield Game_1.default.deleteMany({});
        //set status to 200 and send message saying games were delted
        res.status(200).send({ message: "Games have been deleted" });
    }
    //catch any errors along the way
    catch (err) {
        //set status to 500 and send error message
        res.status(500).send({ message: err });
    }
}));
//export router
module.exports = router;
