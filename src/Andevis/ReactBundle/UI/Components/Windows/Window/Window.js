import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd'
import ItemTypes from './../ItemTypes'
import classNames from 'classnames'
import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import './Window.scss';
import { autobind } from 'core-decorators';
import { windowsStore } from '@AndevisReactBundle/UI/Stores';

const boxSource = {
    beginDrag(props) {
        const { id, top, left, zIndex } = props;
        return {
            id, top, left, zIndex
        };
    },
};


class WindowTitle extends React.Component{
    static propTypes = {
        title: PropTypes.any
    };

    shouldComponentUpdate(){
        return false;
    }

    render(){
        return this.props.title ? this.props.title : null;
    }
}


@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
}))
export default class Window extends React.Component{
    static propTypes = {
        id: PropTypes.any,
        title: PropTypes.any,
        className: PropTypes.string,
        modal: PropTypes.bool,
        centred: PropTypes.bool,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        footerContent: PropTypes.any,
        content: PropTypes.node,
        isDragging: PropTypes.bool.isRequired,
        customClose: PropTypes.func,
        width: PropTypes.any,
        height: PropTypes.any,
        closable: PropTypes.bool
    };

    static defaultProps = {
        centred: false,
        closable: true
    };

    static contextTypes = {
        windowContainer: PropTypes.object.isRequired,
    };

    static childContextTypes = {
        window: PropTypes.object.isRequired
    };

    getChildContext() {
        return {
            window: this
        };
    }

    get windowModel(){
        return windowsStore.getWindowById(this.props.id);
    }

    close(){
        windowsStore.removeWindow(this.windowModel);
    }

    move(left, top){
        this.windowModel.move(left, top);
    }

    bringToFront(){
        if(this.windowModel){
            this.windowModel.bringToFront();
        }
    }

    @autobind
    handleHeaderClick(){
        this.bringToFront();
    }

    @autobind
    handleFocus(){
        this.bringToFront();
    }

    @autobind
    handleDragEnd(){
        this.bringToFront();
    }

    @autobind
    handleClose(){
        if(this.props.customClose){
            this.props.customClose(this);
        } else {
            this.close();
        }
    }


    componentDidMount(){
        if(this.props.centred && this.windowBox){
            const containerRect = this.context.windowContainer.box.getBoundingClientRect();
            const windowRect = this.windowBox.getBoundingClientRect();
            const left = (containerRect.width / 2) - (windowRect.width / 2);
            let top = (containerRect.height / 2) - (windowRect.height / 2);

            // Golden position
            if(top > 0) {
                top = (top / 3) * 2;
            } else if (top < 0) {
                top = 10;
            }
            this.move(left, top);
        }
    }

    /**
     * Render window controls
     */
    @autobind
    renderHeaderControls()
    {
        return (
            <div className="btn-group pull-right control-buttons">
                {this.props.closable &&
                    <button className="btn-sm btn fa fa-window-close" onClick={this.handleClose} />
                }
            </div>
        );
    }

    /**
     * Render window
     */
    render()
    {
        const { isDragging, connectDragSource, connectDragPreview } = this.props;
        const opacity = isDragging ? 0.4 : 1;

        const windowZIndex = this.props.modal ? 10000 + this.props.zIndex + 1 : this.props.zIndex;
        const style = {
            position: 'absolute',
            left: this.props.left,
            top: this.props.top,
            width: this.props.width,
            height: this.props.height,
            zIndex: windowZIndex
        };

        const handleStyle = {
            userSelect: false,
            cursor: 'move',
        };
        let window = connectDragPreview(
            <div
                className={classNames(this.props.className, "component-window panel panel-primary")}
                ref={(windowBox) => {
                    this.windowBox = windowBox;
                }}
                style={{ ...style, opacity }}
                >
                {connectDragSource(
                    <div
                        className="panel-heading clearfix"
                        style={handleStyle}
                        unselectable="on"
                        onSelect={false}
                        onDragEnd={this.handleDragEnd}>
                        { React.isValidElement(this.props.title) ? <WindowTitle title={this.props.title} /> : this.props.title }
                        {this.renderHeaderControls()}
                    </div>
                )}
                <div className="panel-wrapper content">
                    {this.props.content}
                    { this.props.footerContent &&
                        <div className="panel-footer clearfix">{this.props.footerContent}</div>
                    }
                </div>
            </div>
        );

        // Wrap in the modal layer
        if(this.props.modal)
        {
            window = <div className="window-modal-layer" style={{
                zIndex: windowZIndex - 1
            }}>{window}</div>;
        }

        return window
    }
}

export {
    Window
}