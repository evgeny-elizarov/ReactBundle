import React from 'react';
import {Component} from "@AndevisReactBundle/UI/ComponentBase";
import { autobind } from 'core-decorators';

export default class ExampleComponent extends Component {

    getBundleName() {
        return 'React';
    }

    constructor(props, context){
        super(props, context);
        this.state = {
            dateTime: 'not loaded',
            dateTimeLoading: false,
            longTaskStart: null,
            longTaskComplete: null,
            longTaskLoading: false,
        };
    }

    eventList(){
        return super.eventList().concat(['loadDate', 'longTask']);
    }

    componentDidMount(){
        super.componentDidMount();
        this.loadDate();
    }

    // Always call backend
    allowCallEventBackend(eventName){
        if(eventName === 'loadDate' || eventName === 'longTask'){
            return true;
        } else {
            return super.allowCallEventBackend(eventName);
        }
    }

    @autobind
    loadDate(){
        return this.setState(
            { dateTimeLoading: true },
            () => {
                this.fireEvent('loadDate').then((serverDate) => {
                    this.setState({
                        dateTime: serverDate,
                        dateTimeLoading: false
                    });
                });
            });
    }


    @autobind
    longTask(){
        this.setState(
            { longTaskLoading: true },
            () => {
                this.fireEvent('longTask').then((data) => {
                    if(data){
                        this.setState({
                            longTaskStart: data['start'],
                            longTaskComplete: data['complete'],
                            longTaskLoading: false
                        });
                    }

                });
            });
    }

    @autobind
    allTasks(){
        this.loadDate();
        this.longTask();
    }

    render(){
        return (
            <div>
                <div>
                    Server data time: {this.state.dateTime}
                    { this.state.dateTimeLoading && 'Loading...' }
                </div>
                <div>
                    Long task start: {this.state.longTaskStart}<br/>
                    Long task complete: {this.state.longTaskComplete}
                    { this.state.longTaskLoading && 'Loading...' }
                </div>
                <button className="btn btn-default" onClick={this.loadDate} disabled={this.state.dateTimeLoading}>
                    Refresh date
                </button>
                <button className="btn btn-default" onClick={this.longTask} disabled={this.state.longTaskLoading}>
                    Long task
                </button>
                <button className="btn btn-default" onClick={this.allTasks} disabled={this.state.longTaskLoading || this.state.dateTimeLoading}>
                    Call all tasks
                </button>
            </div>
        )
    }

}