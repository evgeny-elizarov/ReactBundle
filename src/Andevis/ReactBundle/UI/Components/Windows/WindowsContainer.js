import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ItemTypes from './ItemTypes';
import { Window } from './Window/Window';
import {observer} from 'mobx-react';
import { windowsStore } from '@AndevisReactBundle/UI/Stores';
import './WindowsContainer.scss';

const boxTarget = {
    drop(props, monitor, component) {
        const { id, left, top } = monitor.getItem();
        const delta = monitor.getDifferenceFromInitialOffset();
        const windowStore = windowsStore.getWindowById(id);
        windowStore.move(
            Math.round(left + delta.x),
            Math.round(top + delta.y)
        );
    },
};


@observer
class WindowsPoll extends React.Component{

    static propTypes = {
        className: PropTypes.any,
        store: PropTypes.object.isRequired
    };

    render(){
        return (
            <div className={this.props.className}>
                {this.props.store.getPoll().map((window) => {
                    return (
                        <Window key={window.id} {...window} />
                    )
                })}
            </div>
        )
    }
}

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.BOX, boxTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
export default class WindowsContainer extends React.Component {

    static propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
    };

    static childContextTypes = {
        windowContainer: PropTypes.object
    };

    getChildContext() {
        return {
            windowContainer: this
        };
    }

    render() {
        const { connectDropTarget } = this.props;
        const styles = {
            position: 'absolute',
            width: '100%',
            height: 'auto',
            minHeight: '100%',
            overflowX: 'hidden'
        };
        return connectDropTarget(
            <div className="windows-polls" style={styles} ref={(box) => {
                this.box = box;
            }}>
                {this.props.children}
                <WindowsPoll className="windows-poll" store={windowsStore}/>
            </div>,
        )
    }
}