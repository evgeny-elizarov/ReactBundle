import React from '@AndevisReactBundle/react';
import PropTypes from "@AndevisReactBundle/prop-types";
import { isGranted } from "@AndevisAuthReactBundle/UI/Helpers/security";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import { authStore } from "@AndevisAuthReactBundle/UI/Stores";
import messages from "@AndevisReactBundle/UI/Components/View/messages";
import { autobind } from "@AndevisReactBundle/decorators";
import TechInfoAccessForbiddenError from '@AndevisReactBundle/UI/Common/TechInfoAccessForbiddenError/TechInfoAccessForbiddenError';

export default class ErrorAccessForbidden extends React.Component {

    static contextTypes = {
        router: PropTypes.object,
    };

    static propTypes = {
        component: PropTypes.object
    };

    constructor(props, context){
        super(props, context);
        this.state = {
            showTechnicalInfo: false
        }
    }

    /**
     * Show technical info
     */
    @autobind
    handleShowTechnicalInfo(){
        this.setState({ showTechnicalInfo: !this.state.showTechnicalInfo });
    }

    render (){
        return (
            <div>
                <a onClick={this.handleShowTechnicalInfo} style={{ cursor: 'pointer' }}>{i18n(messages.accessDenied)}</a>
                {this.state.showTechnicalInfo &&
                    <TechInfoAccessForbiddenError component={this.props.component} />
                }
            </div>
        )
    }
}
