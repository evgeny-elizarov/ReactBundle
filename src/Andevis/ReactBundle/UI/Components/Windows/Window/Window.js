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

    // /**
    //  * Render window header
    //  */
    // renderHeader(){
    //     const handleStyle = {
    //         userSelect: false,
    //         cursor: 'move',
    //     };
    //     return (
    //
    //     );
    // }


    componentDidMount(){
        if(this.props.centred && this.windowBox){
            const containerRect = this.context.windowContainer.box.getBoundingClientRect();
            const windowRect = this.windowBox.getBoundingClientRect();
            const left = (containerRect.width / 2) - (windowRect.width / 2);
            let top = (containerRect.height / 2) - (windowRect.height / 2);

            // Golden position
            if(top > 0) {
                top = (top / 3) * 2;
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



/**
 * Window
 */
class _Window extends Component {

    // static propTypes = {
    //     windowStore: PropTypes.object.isRequired,
    // };

    static propTypes = Object.assign({}, Component.propTypes, {
        // isOpen: PropTypes.bool.isRequired,
        // window: PropTypes.object.isRequired,
        footerContent: PropTypes.any,
        title: PropTypes.string,
        visible: PropTypes.bool.isRequired,
        left: PropTypes.number,
        top: PropTypes.number,
        width: PropTypes.any.isRequired,
        height: PropTypes.any.isRequired,
        modal: PropTypes.bool,
        children: PropTypes.node,
    });

    static defaultProps =  Object.assign({}, Component.defaultProps, {
        visible: true,
        width: 'auto',
        height: 'auto',
        modal: false
    });

    windowStore = null;

    constructor(props, context){
        super(props, context);
        this.id = guid();
    }

    getBundleName(){
        return 'React';
    }

    eventList(){
        return super.eventList().concat(['close']);
    }


    /**
     * Attribute: title
     * @returns {*}
     */
    get title() {
        return this.getAttributeValue('title', this.props.title ? this.props.title : this.getName());
    }

    set title(value) {
        this.setAttributeValue('title', value);
    }

    /**
     * Attribute: visible
     * @returns {*}
     */
    get visible() {
        return this.getAttributeValue('visible', this.props.visible);
    }

    set visible(value) {
        console.log("Visible ", value);
        this.setAttributeValue('visible', value);
    }

    /**
     * Attribute: left
     * @returns {*}
     */
    get left() {
        return this.getAttributeValue('left', this.props.left);
    }

    set left(value) {
        this.setAttributeValue('left', value);
    }

    /**
     * Attribute: top
     * @returns {*}
     */
    get top() {
        return this.getAttributeValue('top', this.props.top);
    }

    set top(value) {
        this.setAttributeValue('top', value);
    }

    mountWindow(){
        if(!this.windowStore) {
            this.windowStore = windowsStore.newWindow(this);
        }
    }

    unmountWindow(){
        if(this.windowStore) {
            windowsStore.removeWindow(this.windowStore);
            this.windowStore = null;
        }
    }

    @autobind
    show(){
        this.mountWindow();
    }

    @autobind
    hide(){
        this.unmountWindow();
    }

    @autobind
    move(left, top){
        if(!this.windowStore){
            throw new Error('Window not created yet!');
        }
        this.windowStore.move(left, top);
    }

    componentDidMount(){
        super.componentDidMount();
        this.mountWindow();
    }

    componentWillReceiveProps(nextProps){
        if(this.props.visible !== nextProps.visible){
            this.visible = nextProps.visible;
            this.visible ? this.mountWindow() : this.unmountWindow();
        }
    }

    componentWillUnmount() {
        this.unmountWindow();
    }


    //
    // /**
    //  * Attribute: width
    //  * @returns {*}
    //  */
    // get width() {
    //     return this.getAttributeValue('width', this.props.width ? this.props.width : 'auto');
    // }
    //
    // set width(value) {
    //     this.setAttributeValue('width', value);
    // }
    //
    // /**
    //  * Attribute: height
    //  * @returns {*}
    //  */
    // get height() {
    //     return this.getAttributeValue('height', this.props.height ? this.props.height : 'auto');
    // }
    //
    // set height(value) {
    //     this.setAttributeValue('height', value);
    // }
    //
    // /**
    //  * Attribute: zIndex
    //  * @returns {*}
    //  */
    // get zIndex() {
    //     return this.getAttributeValue('zIndex', this.windowStore.zIndex);
    // }
    //
    // set zIndex(value) {
    //     this.setAttributeValue('zIndex', value);
    // }



    @autobind
    handleDragEnd(){
        // this.windowStore.setMaxZIndex();
    }

    @autobind
    handleFocus(){
        if(this.windowStore)
            this.windowStore.setMaxZIndex();
    }

    renderHeader(props){
        const handleStyle = {
            userSelect: false,
            cursor: 'move',
        };
        return (
            <div
                className="panel-heading clearfix"
                style={handleStyle}
                unselectable="on"
                onSelect={false}
                onDragEnd={this.handleDragEnd}>
                {props.title}
                {this.renderHeaderControls(props)}
            </div>
        );
    }

    renderHeaderControls(){
        return (
            <div className="btn-group pull-right control-buttons">
                <button className="btn-sm btn fa fa-window-close" onClick={this.handleClose} />
            </div>
        );
    }

    renderBody(props){
        return (
            <div className="panel-body">{ props.children }</div>
        )
    }

    componentWillUpdate(){
        if(this.windowStore)
        {
            console.log("Window refresh");
            this.windowStore.refresh();
        }
    }

    render(){
        return null;
    }
}

export {
    Window,
    // WindowBox
}