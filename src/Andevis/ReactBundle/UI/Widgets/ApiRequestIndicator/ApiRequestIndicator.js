/**
 * Created by EvgenijE on 10.05.2017.
 */
import React, { Component } from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import clientSubscribeService from "@AndevisReactBundle/UI/GraphQL/clientSubscribeService";
import ProgressBar from '@AndevisReactBundle/UI/Components/ProgressBar/ProgressBar';
import './ApiRequestIndicator.scss';


export default class ApiRequestIndicator extends Component {

    static contextTypes = {
        appState: PropTypes.object
    };

    constructor(props, context){
        super(props, context);
        this.state = {
            inProgress: false,
            createdRequests: 0,
            completedRequests: 0
        }
    }

    componentDidMount(){

        // Catch created API request
        this.apiMiddlewareSubs = clientSubscribeService.registerMiddleware(() => {
            if(!this.state.inProgress) {
                this.setState({
                    inProgress: true,
                    createdRequests: 1,
                    completedRequests: 0,
                });
            } else {
                this.setState({
                    createdRequests: this.state.createdRequests + 1,
                });
            }

        });

        // Catch completed API request
        this.apiAfterwareSubs = clientSubscribeService.registerAfterware(() => {
            if((this.state.createdRequests - 1) === this.state.completedRequests ) {
                this.setState({
                    inProgress: false,
                    completedRequests: this.state.completedRequests + 1,
                });
                setTimeout(() => {
                    if(!this.state.inProgress)
                    {
                        this.setState({
                            createdRequests: 0,
                            completedRequests: 0
                        });
                    }
                }, 800);
            } else {
                this.setState({
                    completedRequests: this.state.completedRequests + 1,
                });
            }
        });

        // On error reset all status to defaults
        this.clientErrorSubs = clientSubscribeService.registerErrorHandler(() => {
            this.setState({
                inProgress: false,
                createdRequests: 0,
                completedRequests : 0
            });
        });
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        clientSubscribeService.unregisterMiddleware(this.apiMiddlewareSubs);
        clientSubscribeService.unregisterMiddleware(this.apiAfterwareSubs);
    }

    render() {
        const progress = (this.state.createdRequests > 0) ? (this.state.createdRequests + this.state.completedRequests) / (this.state.createdRequests * 2) : 0;
        const showHide = this.state.inProgress ? 1 : 0;
        return (
            <div className={"api-indicator"} style={{opacity: showHide}}>
                <ProgressBar progress={progress} styleType={"danger"} />
            </div>
        )
    }
}
