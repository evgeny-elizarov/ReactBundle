import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd'
import ItemTypes from './../ItemTypes'
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


@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
}))
class WindowBox extends React.Component{
    static propTypes = {
        id: PropTypes.any,
        title: PropTypes.string,
        visible: PropTypes.bool,
        modal: PropTypes.bool,
        left: PropTypes.number.isRequired,
        top: PropTypes.number.isRequired,
        footerContent: PropTypes.any,
        windowComponent: PropTypes.object,
        children: PropTypes.node,
        onFocus: PropTypes.func,
        onDragEnd: PropTypes.func,
        onClose: PropTypes.func
    };



    render() {
        console.log("Window box render");

        const { isDragging, connectDragSource, connectDragPreview } = this.props;
        const opacity = isDragging ? 0.4 : 1;

        const windowZIndex = this.props.modal ? 10000 + this.props.zIndex + 1 : this.props.zIndex;
        const style = {
            position: 'absolute',
            left: this.props.left,
            top: this.props.top,
            width: this.props.width,
            height: this.props.height,
            zIndex: windowZIndex,
            display: this.props.visible ? 'block' : 'none'
        };

        let window = connectDragPreview(
            <div
                className="component-window panel panel-primary"
                style={{ ...style, opacity }}
                onClick={() => {
                    if(this.props.onFocus) this.props.onFocus();
                }}>
                {connectDragSource(this.props.windowComponent.renderHeader(this.props))}
                <div className="panel-wrapper">
                    <div className="panel-body">{ this.props.children }</div>
                    { this.props.footerContent &&
                    <div className="panel-footer clearfix">{this.props.footerContent}</div>
                    }
                </div>
            </div>
        );

        if(this.props.modal)
        {
            window = <div className="window-modal-layer" style={{
                zIndex: windowZIndex - 1
            }}>{window}</div>;
        }

        return (
            window
        )
    }
}


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * Window
 */
export default class Window extends Component {

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
    handleClose(){
        this.hide();
        // const window = windowsStore.getWindowById(this.props.id);
        // windowsStore.removeWindow(window);
    }

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
    WindowBox
}