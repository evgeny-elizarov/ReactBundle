import React from 'react';
import PropTypes from 'prop-types';
// TODO: remove id, use getBundle method
export default (bundleName) => (WrappedComponent) => {
    class Bundle extends React.Component {
        // constructor(props){
        //     super({
        //         bundleName: bundleName
        //     });
        //     this.childProps = props;
        // }

        static propTypes = {
            name: PropTypes.string.isRequired
        };

        static childContextTypes = {
            bundleName: PropTypes.string.isRequired,
        };

        getChildContext() {
            return {
                bundleName: bundleName
            };
        }

        render() {
            return <WrappedComponent {...this.props} />
        }
    }
    return Bundle;
}
