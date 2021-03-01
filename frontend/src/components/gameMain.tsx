//imports
import React, { Component } from 'react';
import NBAMore from './nbaMore';
import MLBMore from './mlbMore';
import './gameMain.scss';

/**
 * Interface to represent the props of the main game component
 */
interface IProps {
    league: string;
    info: any;
}

/**
 * Interface to represent the state of the main game component
 */
interface IState {
    collapsed: boolean;
    currentStat: number,
}

/**
 * A component to represent the main portion of a game
 * Will show the status of the game
 * Will show the score for the game by period
 * Will have a button for "show more" that will expand the game and show the additional stats
 */
class GameMain extends Component<IProps, IState> {

    //the game object
    private game: any;
    //array of the available leagues

    /**
     * Constructor of the GameMain class
     * Will define the state for the class
     */
    constructor(props: IProps) {
        super(props);

        //defining base state
        this.state = {
            collapsed: true,
            currentStat: 1,
        };
    }

    /**
     * A function to toggle the state of the game from collapsed to expanded and vice cersa
     */
    toggleSeeMore(): void {
        //setting the new state of collapsed to the opposite of the old state
        this.setState({ collapsed: !this.state.collapsed});
    }

    /**
     * A function to change the selected stat selction to the one the user clicks on
     * Will set the state of current to the new stat
     * @param newStat - the index of the stat section the user has clicked on
     * @return void
     */
    toggleStat(newStat: number): void {
        //setting the state of currentStat to the league the user clicks on
        this.setState({ currentStat: newStat});
    }

    /**
     * A function to determine if a stat is currently selected or not
     * Will check the index of the stat passed in with the state of currentState
     * @param statIndex - the index of the stat being checked
     * @return boolean: true is the stat passed in is equal to the state of currentStat, false otherwise
     */
    isStatOn(statIndex: number): boolean {
        //checking if statIndex is equal to the state of currentStat and returning the expression value
        return statIndex === this.state.currentStat;
    }

    /**
     * render function
     */
    render() {
        //define the collapsed string
        let collapsed: string = this.state.collapsed ? "collapsed" : "expanded";
        //define the number of periods for the game based on which league the game is for
        let numPeriods: number = this.props.league === "NBA" ? 4 : this.props.league === "MLB" ? 9 : 0;

        //define game as the info part of the object passed to the component
        this.game = this.props.info;

        let moreStatsOptions: Array<string> = [this.game.away_team.abbreviation, "Game", this.game.home_team.abbreviation];

        //defining away score variables
        let awayScores = this.game.away_period_scores;
        while (awayScores.length < numPeriods) {
            awayScores.push(0);
        }
        const awayTotal = awayScores.reduce((a: number, b: number) => a + b, 0);

        //defining home score variables
        let homeScores = this.game.home_period_scores;
        while (homeScores.length < numPeriods) {
            homeScores.push(0);
        }
        const homeTotal = homeScores.reduce((a: number, b: number) => a + b, 0);

        //define variables for map keys
        let periodNum = 1, homeKey = 0, awayKey = 0;

        return (
            <div className={`game`}>
                <p id={"progress"}>{this.props.info.event_information.status === "completed" ? "FINAL" : this.props.info.event_information.status}</p>
                <div className={`game-info ${collapsed}`}>
                    <table className={"box-score-table"}>
                        <tbody>
                        <tr>
                            <th> </th>
                            {awayScores.map((period: number) => (
                                <th key={periodNum}>{periodNum++}</th>
                            ))}

                            {this.props.league === "MLB" ? (
                                <th>R</th>
                            ) : (
                                <th>Total</th>
                            )}
                            {this.props.league === "MLB" ? (
                                <th>H</th>
                            ) : null}
                            {this.props.league === "MLB" ? (
                                <th>E</th>
                            ) : null}
                        </tr>
                        <tr>
                            <th>{this.game.away_team.abbreviation}</th>
                            {awayScores.map((period: number) => (
                                <td key={awayKey++}>{period}</td>
                            ))}

                            <td className={"total"} {...awayTotal > homeTotal && this.game.event_information.status === "completed" ? {id: "winner"} : null}>{awayTotal}</td>

                            {this.props.league === "MLB" ? (
                                <td className={"total"}>{this.game.away_batter_totals.hits}</td>
                            ) : null}
                            {this.props.league === "MLB" ? (
                                <td className={"total"}>{this.game.away_errors}</td>
                            ) : null}</tr>
                        <tr>
                            <th>{this.game.home_team.abbreviation}</th>
                            {homeScores.map((period: number) => (
                                <td key={homeKey++}>{period}</td>
                            ))}
                            <td className={"total"} {...homeTotal > awayTotal && this.game.event_information.status === "completed" ? {id: "winner"} : null}>{homeTotal}</td>

                            {this.props.league === "MLB" ? (
                                <td className={"total"}>{this.game.home_batter_totals.hits}</td>
                            ) : null}
                            {this.props.league === "MLB" ? (
                                <td className={"total"}>{this.game.home_errors}</td>
                            ) : null}
                        </tr>
                        </tbody>
                    </table>
                    {!this.state.collapsed ? (
                        <div id={"more-stats"}>
                            <div id={"stat-options"}>
                                <button className={"stat-button left"} id={this.isStatOn(0).toString()} onClick={()=>{this.toggleStat(0)}}>
                                    {moreStatsOptions[0]}
                                </button>
                                <button className={"stat-button"} id={this.isStatOn(1).toString()} onClick={()=>{this.toggleStat(1)}}>
                                    {moreStatsOptions[1]}
                                </button>
                                <button className={"stat-button right"} id={this.isStatOn(2).toString()} onClick={()=>{this.toggleStat(2)}}>
                                    {moreStatsOptions[2]}
                                </button>
                            </div>
                            <div id={"more-stats-stat-tables"}>
                                {this.props.league === "NBA" ? (
                                    <NBAMore info={this.props.info} selectedStat={this.state.currentStat}/>
                                ) : this.props.league === "MLB" ? (
                                    <MLBMore info={this.props.info} selectedStat={this.state.currentStat}/>
                                ) : null}
                            </div>
                        </div>
                    ): null}
                </div>
                {this.state.collapsed ? (<p id={"see-more"} onClick={()=> {this.toggleSeeMore()}}>See More Stats</p>) : (<p id={"see-more"} onClick={()=> {this.toggleSeeMore()}}>See Less Stats</p>)}
            </div>
        );
    }
}

export default GameMain;