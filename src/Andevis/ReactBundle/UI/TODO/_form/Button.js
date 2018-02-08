/**
 * Created by EvgenijE on 28.06.2017.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Button extends React.Component {

    render() {

        let props = Object.assign({}, this.props);

        let classes = [];

        if(typeof this.props.styleType !== 'undefined')
        {
            classes.push('btn-' + this.props.styleType);
            delete props['styleType'];
        }

        if(typeof this.props.className !== 'undefined')
        {
            classes.push(this.props.className);
            delete props['className'];
        }

        let btnClass = classNames('btn', classes);
        if(props.type === 'link') {
            return (
                <a className={btnClass} {...props}>
                    {this.props.children}
                </a>
            )
        } else {
            return (
                <button className={btnClass} {...props}>
                    {this.props.children}
                </button>
            )
        }
    }
}

Button.propTypes = {
    styleType: PropTypes.string,
    type: PropTypes.string
};

Button.defaultProps = {
    styleType: 'default',
    type: 'button'
};

export default Button;
