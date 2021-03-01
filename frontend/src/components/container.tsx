//imports
import React, { Component } from 'react';
import './container.scss';
import GameMain from "./gameMain";
import axios from 'axios';
import config from "../helpers/config";

/**
 * Interface to define the state of the container component
 */
interface IState {
    //the current league selected by the user
    currentLeague: number,
    //array of nba games
    games: Array<any>,
}

/**
 * A component to represent the outer container on the screen
 * Will be available in all views
 * WIll allow for the league to be selected by the user
 * Will house all games in the selected league
 */
class Container extends Component<{}, IState> {

    //array of the available leagues
    private leagues: string[] = ['NBA', 'MLB'];

    /**
     * Constructor of the container class
     * Will define the state for the class
     */
    constructor(props: any) {
        super(props);

        //defining base state
        this.state = {
            //if currentLeague is defined in local storage, set the state of currentLeague to it, if not set currentLeague to 0
            currentLeague: !!localStorage.getItem("currentLeague") ? parseInt(localStorage.getItem("currentLeague") as string) : 0,
            games: [],
        };
    }

    /**
     * A function to change the selected league to the one the user clicks on
     * Will set the state of currentLeague to the new league, and update currentLeague in local storage
     * @param newLeague - the index of the league the user has clicked on
     * @return void
     */
    toggleLeague(newLeague: number): void {
        //setting the state of currentLeague to the league the user clicks on
        this.setState({ currentLeague: newLeague});
        //updating currentLeague in localStorage
        localStorage.setItem('currentLeague', JSON.stringify(newLeague));
    }

    /**
     * A function to determine if a league is currently selected or not
     * Will check the index of the league passed in with the state of currentLeague
     * @param leagueIndex - the index of the league being checked
     * @return boolean: true is the league passed in is equal to the state of currentLeague, false otherwise
     */
    isLeagueOn(leagueIndex: number): boolean {
        //checking if leagueIndex is equal to the state of currentLeague and returning the expression value
        return leagueIndex === this.state.currentLeague;
    }

    /**
     * A function called once the component is mounted on the screen
     * Will call the api to get the current games available
     */
    async componentDidMount() {
        //call the api and store the response
        const response = await axios.get(config.API_LOCATION + "games");
        // console.log(response.data);
        try {
            //set the state of games the response
            this.setState({
                games: response.data
            });
        }
        //catch any errors along the way
        catch (error) {
            //log the error
            console.log(error);
        }
    }

    /**
     * render function
     */
    render() {

        //creating an array to hold only the games of hte league that is selected
        let filteredGames: Array<any> = [];

        //filter the games by which sport is selected currently
        if (this.state.games.length !== 0) {
            filteredGames = this.state.games.filter(
                game => game.info.league === this.leagues[this.state.currentLeague]
            );
        }

        return (
            <div id={"cont-border"}>
                <div id={"league-options"}>
                    <button className={"league-button left"} id={this.isLeagueOn(this.leagues.indexOf("NBA")).toString()} onClick={()=>{this.toggleLeague(this.leagues.indexOf("NBA"))}}>
                        NBA
                    </button>
                    <button className={"league-button right"} id={this.isLeagueOn(this.leagues.indexOf("MLB")).toString()} onClick={()=>{this.toggleLeague(this.leagues.indexOf("MLB"))}}>
                        MLB
                    </button>
                </div>
                <div id={"games-list"}>
                    {filteredGames.length > 0 ? (
                        filteredGames.map(filteredGame => (
                            <GameMain key={filteredGame._id} league={filteredGame.info.league} info={filteredGame.info}/>
                        ))
                    ) : null}
                </div>
            </div>
        );
    }
}

export default Container;