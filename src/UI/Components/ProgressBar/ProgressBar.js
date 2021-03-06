import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Component } from '../../ComponentBase/index';
import './ProgressBar.scss';

export default class ProgressBar extends Component {

    static bundleName = 'React';

    static propTypes = Object.assign({}, Component.propTypes, {
        progress: PropTypes.number,
        styleType: PropTypes.string,
    });

    static defaultProps = Object.assign({}, Component.defaultProps, {
        styleType: 'primary',
    });

    getShortClassName() {
        return 'ProgressBar';
    }

    render() {
        const progress = this.props.progress > 1 ? 100 : (
            this.props.progress < 0 ? 0 : this.props.progress * 100);
        return (
            <div className={classNames('progressBar', this.props.styleType)}>
                <div className="progress" style={{ width: `${progress}%`}} />
            </div>
        )
    }
}
