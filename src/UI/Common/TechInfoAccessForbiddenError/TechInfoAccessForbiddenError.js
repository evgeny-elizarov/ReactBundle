import React from "@AndevisReactBundle/react";
import PropTypes from "@AndevisReactBundle/prop-types";
import { isGranted } from "@AndevisAuthReactBundle/UI/Helpers/security";
import { i18n } from "@AndevisReactBundle/UI/Translation";
import { authStore } from "@AndevisAuthReactBundle/UI/Stores";
import messages from "@AndevisReactBundle/UI/Common/TechInfoAccessForbiddenError/messages";
import { autobind } from "@AndevisReactBundle/decorators";

export default class TechInfoAccessForbiddenError extends React.Component {
    static propTypes = {
        component: PropTypes.object
    };

    render (){
        return (
            <table className="table table-bordered table-striped">
                <tbody>
                <tr>
                    <th width="30%">{i18n(messages.componentName)}</th>
                    <td>{this.props.component.getName()}</td>
                </tr>
                <tr>
                    <th>{i18n(messages.currentUser)}</th>
                    <td>{authStore.user.username}</td>
                </tr>
                <tr>
                    <th>{i18n(messages.userRoles)}</th>
                    <td>
                        <ul>
                            {authStore.userRoles.map((role, i) => (
                                <li key={i}>{role}</li>
                            ))}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>{i18n(messages.accessPermission)}</th>
                    <td>{this.props.component.constructor.getAccessPermission()}</td>
                </tr>
                </tbody>
            </table>
        )
    }
}
