"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//imports
const mongoose_1 = require("mongoose");
/**
 * Schema to represent a game
 * Will have one field other than the defaults - info which will be all info about the game
 */
const GameSchema = new mongoose_1.Schema({
    info: {
        type: mongoose_1.Schema.Types.Mixed
    }
}, { timestamps: true });
//set Game equal to the model that was created
const Game = mongoose_1.model('Game', GameSchema);
//export Game
exports.default = Game;
