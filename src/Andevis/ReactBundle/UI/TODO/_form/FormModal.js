/**
 * Created by EvgenijE on 02.08.2017.
 */
import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { translatable } from '../../decorators/i18n';
import {Form } from 'react-form'
import Button from './Button'
import classNames from 'classnames';

class FormModal extends React.Component {
    componentWillReceiveProps(nextProps)
    {
        if(this.props.onOpen && !this.props.isOpen && nextProps.isOpen)
        {
            this.props.onOpen();
        }
    }

    render() {

        let submitButtonLabel = this.i18n('Submit');
        if(this.props.submitButtonLabel) {
            submitButtonLabel = this.props.submitButtonLabel;
        }
        let headerClasses = classNames('modal-header', 'bg-'+this.props.styleType);
        let props = Object.assign({}, this.props);
        props.title = (props.title) ? props.title : this.i18n('Dialog');
        props.contentLabel = props.title;

        return (
            <Modal {...props}>
                { this.props.isOpen &&
                    <Form
                        ref={ form => this.form = form }
                        defaultValues={this.props.defaultValues}
                        validate={this.props.validate}
                        onSubmit={this.props.onSubmit}>
                        {(api) => {
                            return (
                                <div className="modal-content">
                                    <div className={headerClasses}>
                                        <h4 className="modal-title">{this.props.title ? this.props.title : this.i18n('Dialog')}</h4>
                                    </div>
                                    <div className="modal-body">
                                        {typeof this.props.children === 'function' ? this.props.children(api) : this.props.children }
                                    </div>
                                    <div className="modal-footer">
                                        <Button onClick={api.submitForm}
                                                styleType={this.props.styleType}>{submitButtonLabel}</Button>
                                        <Button onClick={this.props.onCancel}>{this.i18n('Cancel')}</Button>
                                    </div>
                                </div>
                            );
                        }}
                    </Form>
                }
            </Modal>
        )
    }
}


FormModal.propTypes = {
    defaultValues: PropTypes.object,
    title: PropTypes.string,
    style: PropTypes.object,
    onSubmit: PropTypes.func,
    validate: PropTypes.func,
    onCancel: PropTypes.func,
    contentLabel: PropTypes.string,
    styleType: PropTypes.string,
    submitButtonLabel: PropTypes.string,
    onOpen: PropTypes.func
};

FormModal.defaultProps = {
    defaultValues: {},
    validate: () => {},
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


export default translatable('components.FormModal')(FormModal);



