/**
 * Created by EvgenijE on 10.05.2017.
 */
import React from 'react'
import ProgressBar from '@AndevisReactBundle/UI/Components/ProgressBar/ProgressBar';
import './ApiRequestIndicator.scss';


export default class ApiRequestIndicator extends ProgressBar {

    getInitialState(){
        return {
            inProgress: false,
            createdRequests: 0,
            completedRequests: 0
        }
    }

    componentDidMount(){

        // Catch API request begin
        this.subscribeOnEvent('apiOperationBegin', () => {
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

        // Catch completed API request complete
        this.subscribeOnEvent('apiOperationComplete', () => {
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

        // Catch API request error
        this.subscribeOnEvent('apiOperationError', (result) => {
            this.setState({
                inProgress: false,
                createdRequests: 0,
                completedRequests : 0
            });
        });

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
