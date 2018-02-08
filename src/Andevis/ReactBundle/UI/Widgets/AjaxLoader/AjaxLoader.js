/**
 * Created by EvgenijE on 10.05.2017.
 */
import React, { Component } from 'react'
import classNames from 'classnames';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import './AjaxLoader.scss';

@observer
export default class AjaxLoader extends Component {

    static contextTypes = {
        appState: PropTypes.object
    };


    render() {
        const loaderShow = this.context.appState.isPendingRequests;

        const loaderProgress = 1 / (Math.max(0, this.context.appState.pendingRequestCount));

        const progressWrpClasses = classNames(
            'pace',
            {
                'pace-active': loaderShow,
                'pace-inactive': !loaderShow
            }
        );
        const progressClasses = classNames(
            'pace-progress'
        );

        const percent = (loaderShow) ? 100 * loaderProgress : 0;
        const progressStyle = {
            'transform': 'translate3d('+percent+'%, 0px, 0px)'
        };

        return (
            <div className={progressWrpClasses}>
                <div className={progressClasses} style={progressStyle}>
                    <div className="pace-progress-inner" />
                </div>
                {/*<div className="pace-activity"/>*/}
            </div>
        )
    }
}
