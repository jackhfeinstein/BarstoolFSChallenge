//imports
import { model, Schema, Model, Document } from "mongoose";

/**
 * Interface to represent a game
 * Just contains an info property of type object because it will be a json
 */
export interface IGame extends Document {
    info: object
}

/**
 * Schema to represent a game
 * Will have one field other than the defaults - info which will be all info about the game
 */
const GameSchema: Schema = new Schema(
    {
        info: {
            type: Schema.Types.Mixed
        }
    },
    <any> {timestamps: true}
);

//set Game equal to the model that was created
const Game: Model<IGame> = model<IGame>('Game', GameSchema);
//export Game
export default Game;