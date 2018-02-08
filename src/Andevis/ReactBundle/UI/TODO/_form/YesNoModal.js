/**
 * Created by EvgenijE on 26.06.2017.
 */
import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { translatable } from '../../decorators/i18n';
import Button from './Button'
import classNames from 'classnames';


class YesNoModal extends React.Component {

    render() {
        let headerClasses = classNames('modal-header', 'bg-'+this.props.styleType);
        let props = Object.assign({}, this.props);
        props.title = (props.title) ? props.title : this.i18n('Confirmation');
        props.contentLabel = props.title;

        return (
            <Modal {...props}>
                <div className="modal-content">
                    <div className={headerClasses}>
                        <h4 className="modal-title">{this.props.title ? this.props.title : this.i18n('Confirmation')}</h4>
                    </div>
                    <div className="modal-body">
                        { this.props.text && <p>{this.props.text}</p> }
                        {this.props.children}
                    </div>
                    <div className="modal-footer">
                        <Button styleType={this.props.styleType} onClick={this.props.onYes}>{this.i18n('Yes')}</Button>
                        <Button onClick={this.props.onCancel}>{this.i18n('No')}</Button>
                    </div>
                </div>
            </Modal>
        )
    };
}


YesNoModal.propTypes = {
    title: PropTypes.string,
    style: PropTypes.object,
    onYes: PropTypes.func,
    onCancel: PropTypes.func,
    styleType: PropTypes.string
};

YesNoModal.defaultProps = {
    styleType: 'default',
    className: {
        base: 'modal-box modal-box-yes-no',
        afterOpen: 'modal-box_after-open',
        beforeClose: 'modal-box_before-close'
    },
    overlayClassName:{
        base: 'modal-overlay',
        afterOpen: 'modal-overlay_after-open',
        beforeClose: 'modal-overlay_before-close'
    }
};

export default translatable('components.YesNoModal')(YesNoModal);
