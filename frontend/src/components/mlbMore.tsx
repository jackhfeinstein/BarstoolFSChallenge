//imports
import React, { Component } from "react";
import Config from '../helpers/config';
import './moreStats.scss';

/**
 * An interface to represent the props of this component
 */
interface IProps {
    selectedStat: number;
    info: any
}

/**
 * An interface to represent the state of this component
 */
interface IState {
    selectedStat: number;
}

/**
 * A class that will represent the additional stats for an MLB game
 * Will display in depth stats about each team as well as additional information about the game
 */
class MLBMore extends Component<IProps, IState> {

    /**
     * constructor of the MLBMore component
     */
    constructor(props: any) {
        super(props);

        //defining the base state
        this.state = {
            selectedStat: this.props.selectedStat
        }
    }

    /**
     * A function to get the updated props and save it in state
     * @param prevProps - the previous props
     * @return void
     */
    componentDidUpdate(prevProps: any): void {
        //if the previous props are not equal to the current props, then update the state of selectedStat
        if (prevProps.selectedStat !== this.props.selectedStat) {
            this.setState({ selectedStat: this.props.selectedStat });
        }
    }

    render () {

        //variable to keep track of the keys and be a counter
        let id = 0;

        return (
            this.state.selectedStat === 0 ? (
                <table className={"more-stats-table"}>
                    <tbody>
                        <tr>
                            <th id={"header"} >{this.props.info.away_team.abbreviation} Batters</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.away_batters[0]).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        {this.props.info.away_batters.map((batter: any) => (
                            <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                                {Object.values(batter).map((e: any) =>
                                    (<td key={id++}>{e}</td>)
                                )}
                            </tr>
                        ))}
                        <tr>
                            <th id={"header"} >{this.props.info.away_team.abbreviation} Batting Totals</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.away_batter_totals).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                            {Object.values(this.props.info.away_batter_totals).map((e: any) =>
                                (<td key={id++}>{e}</td>)
                            )}
                        </tr>
                        <tr>
                            <th id={"header"} >{this.props.info.away_team.abbreviation} Fielding</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.away_fielding[0]).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        {this.props.info.away_fielding.map((fielder: any) => (
                            <tr {...id++ % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                                {Object.values(fielder).map((e: any) =>
                                    (<td key={id++}>{e}</td>)
                                )}
                            </tr>
                        ))}
                        <tr>
                            <th id={"header"} >{this.props.info.away_team.abbreviation} Pitching</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.away_pitchers[0]).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        {this.props.info.away_pitchers.map((pitcher: any) => (
                            <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                                {Object.values(pitcher).map((e: any) =>
                                    (<td key={id++}>{e}</td>)
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : this.state.selectedStat === 1 ? (
                    <table className={"more-stats-table"}  id={"game-info"}>
                        <tbody>
                            <tr id={"even"}>
                                <th id={"header"} colSpan={2}>Information</th>
                            </tr>
                            <tr id={"odd"}>
                                <th>Location</th>
                                <td>{this.props.info.event_information.site.city}, {this.props.info.event_information.site.state}</td>
                            </tr>
                            <tr id={"even"}>
                                <th>Temperature</th>
                                <td>{this.props.info.event_information.temperature} °F</td>
                            </tr>
                            <tr id={"odd"}>
                                <th>Attendance</th>
                                <td>{this.props.info.event_information.attendance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                            </tr>
                            <tr id={"even"}>
                                <th>Start Time</th>
                                <td>{new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(Date.parse(this.props.info.event_information.start_date_time))}</td>
                            </tr>
                            <tr id={"odd"}>
                                <th>Game Duration</th>
                                <td>{this.props.info.event_information.duration}</td>
                            </tr>
                            <tr id={"even"}>
                                <th id={"header"} colSpan={2}>Umpires</th>
                            </tr>
                            {this.props.info.officials.map((ump: any) => (
                                <tr key={id++} {...id % 2 ? null : {id: "odd"}}>
                                    <th>{ump.position}</th>
                                    <td>{ump.first_name} {ump.last_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
            ) : this.state.selectedStat === 2 ? (
                <table className={"more-stats-table"}>
                    <tbody>
                    <tr>
                        <th id={"header"} >{this.props.info.home_team.abbreviation} Batters</th>
                    </tr>
                    <tr>
                        {Object.keys(this.props.info.home_batters[0]).map((e) =>
                            (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                        )}
                    </tr>
                    {this.props.info.home_batters.map((batter: any) => (
                        <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                            {Object.values(batter).map((e: any) =>
                                (<td key={id++}>{e}</td>)
                            )}
                        </tr>
                    ))}
                    <tr>
                        <th id={"header"} >{this.props.info.home_team.abbreviation} Batting Totals</th>
                    </tr>
                    <tr>
                        {Object.keys(this.props.info.home_batter_totals).map((e) =>
                            (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                        )}
                    </tr>
                    <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                        {Object.values(this.props.info.home_batter_totals).map((e: any) =>
                            (<td key={id++}>{e}</td>)
                        )}
                    </tr>
                    <tr>
                        <th id={"header"} >{this.props.info.home_team.abbreviation} Fielding</th>
                    </tr>
                    <tr>
                        {Object.keys(this.props.info.home_fielding[0]).map((e) =>
                            (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                        )}
                    </tr>
                    {this.props.info.home_fielding.map((fielder: any) => (
                        <tr {...id++ % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                            {Object.values(fielder).map((e: any) =>
                                (<td key={id++}>{e}</td>)
                            )}
                        </tr>
                    ))}
                    <tr>
                        <th id={"header"} >{this.props.info.home_team.abbreviation} Pitching</th>
                    </tr>
                    <tr>
                        {Object.keys(this.props.info.home_pitchers[0]).map((e) =>
                            (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                        )}
                    </tr>
                    {this.props.info.home_pitchers.map((pitcher: any) => (
                        <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                            {Object.values(pitcher).map((e: any) =>
                                (<td key={id++}>{e}</td>)
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : null
        )
    }
}

export default MLBMore;