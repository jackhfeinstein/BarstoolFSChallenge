//imports
import {Request, Response, Router} from "express";
import Game, {IGame} from '../models/Game';
import axios from 'axios';

//define the maximum number times between calls to barstool api
const MAX_TIME_DIFF = 15000;

//define the router
const router = Router();

/**
 * Main games request
 * Will find all the games currently cached in the db
 * If updatedAt time is < 15 seconds ago, it will return the cached data
 * Otherwise, it will fetch new data and return that
 */
router.get('/', async (req: Request, res: Response): Promise<any> => {
    try {
        //getting all games currently in db
        const games = await Game.find({});

        //finding difference in time between when the games in the db were last updated and now
        const timeDiff = Math.abs(new Date().getTime() - games[0].get("updatedAt").getTime())

        //if the time difference is less than the maximum allowed time send the cached data
        if (timeDiff < MAX_TIME_DIFF) {
            console.log("sending cached data");
            res.status(200).send(games);
        }
        //otherwise delete cached data, fetch new data, and return that
        else {
            console.log("sending new data");

            //make delete games request
            const deleted = await axios.delete("http://localhost:5000/games/remove");

            //if the delete worked fetch new data and return that
            if (deleted.status === 200) {
                //make the add games request
                const added = await axios.get("http://localhost:5000/games/add");

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
    catch (err: any) {
        //set status to 500 and send error message
        res.status(500).send({message: err});
    }
})

/**
 * Add games post request
 * Will take game objects in request and store them the db
 */
router.post('/add', async (req: Request, res: Response): Promise<any> => {
    //create array to hold all the games
    let savedGames = [];

    try {
        //iterate through all objects in the request
        for (const league of Object.keys(req.body)) {
            //store each game in constant
            const game: IGame = new Game({
                info: req.body[league]
            })

            //save each game in db
            const savedGame: IGame = await game.save();
            //add game to savedGames array
            savedGames.push(savedGame);
        }

        //set status to 200 and return all saved games
        res.status(200).send(savedGames);
    }
    //catch any errors along the way
    catch (err: any) {
        //set status to 500 and send error message
        res.status(500).send({message: err});
    }
})

/**
 * Add games get request
 * Will get most recent data from the barstool api
 * Then store this data by calling the add post request
 */
router.get('/add', async (req: Request, res: Response): Promise<any> => {
    try {
        //get nba and mlb data from barstool api
        const nba = await axios.get("https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json");
        const mlb = await axios.get("https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json");

        //create the response from the data that was gotten
        const response: any = {
            nbaGame: nba.data,
            mlbGame: mlb.data
        }

        try {
            //make request to add post endpoint with the response that was created
            const postResponse: any = await axios.post("http://localhost:5000/games/add", response);
            //set status to 200 and send the data that was posted
            res.status(200).send(postResponse.data);
        }
            //catch any errors along the way
        catch (err: any) {
            //set status to 500 and send error message
            res.status(500).send({message: err});
        }
    }
    //catch any errors along the way
    catch (err: any) {
        //set status to 500 and send error message
        res.status(500).send({message: err});
    }

})

/**
 * Delete games endpoint
 * Will delete all games from the database
 */
router.delete('/remove', async (req: Request, res: Response): Promise<any> => {
    try {
        //delete all games in the db
        await Game.deleteMany({});
        //set status to 200 and send message saying games were delted
        res.status(200).send({ message: "Games have been deleted" });
    }
    //catch any errors along the way
    catch (err: any) {
        //set status to 500 and send error message
        res.status(500).send({message: err});
    }
})

//export router
module.exports = router;