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
 * A class that will represent the additional stats for an NBA game
 * Will display in depth stats about each team as well as additional information about the game
 */

class NBAMore extends Component<IProps, IState> {

    /**
     * constructor of the NBAMore component
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
                            <th id={"header"} >{this.props.info.away_team.abbreviation} Player Stats</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.away_stats[0]).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        {this.props.info.away_stats.map((player: any) => (
                            <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                                {Object.values(player).map((e: any) =>
                                    (<td key={id++}>{e}</td>)
                                )}
                            </tr>
                        ))}
                        <tr>
                            <th id={"header"} >{this.props.info.away_team.abbreviation} Totals</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.away_totals).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                            {Object.values(this.props.info.away_totals).map((e: any) =>
                                (<td key={id++}>{e}</td>)
                            )}
                        </tr>
                    </tbody>
                </table>
            ) : this.state.selectedStat === 1 ? (
                <table className={"more-stats-table"} id={"game-info"}>
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
                        <th id={"header"} colSpan={2}>Officials</th>
                    </tr>
                    {this.props.info.officials.map((ref: any) => (
                        <tr key={id++} {...id % 2 ? null : {id: "odd"}}>
                            <td colSpan={2}>{ref.first_name} {ref.last_name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : this.state.selectedStat === 2 ? (
                <table className={"more-stats-table"}>
                    <tbody>
                        <tr>
                            <th id={"header"} >{this.props.info.home_team.abbreviation} Player Stats</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.home_stats[0]).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        {this.props.info.home_stats.map((player: any) => (
                            <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                                {Object.values(player).map((e: any) =>
                                    (<td key={id++}>{e}</td>)
                                )}
                            </tr>
                        ))}
                        <tr>
                            <th id={"header"} >{this.props.info.home_team.abbreviation} Totals</th>
                        </tr>
                        <tr>
                            {Object.keys(this.props.info.home_totals).map((e) =>
                                (<th key={id++}>{Config.titleCase(e.replace(/_/g, " "))}</th>)
                            )}
                        </tr>
                        <tr {...id % 2 ? {id: "odd"} : {id : "even"}} key={id++}>
                            {Object.values(this.props.info.home_totals).map((e: any) =>
                                (<td key={id++}>{e}</td>)
                            )}
                        </tr>
                    </tbody>
                </table>
            ) : null
        )
    }
}

export default NBAMore;