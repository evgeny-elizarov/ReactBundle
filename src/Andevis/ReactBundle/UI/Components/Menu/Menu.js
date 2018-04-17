import React from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import Component from "@AndevisReactBundle/UI/ComponentBase/Component";
import classNames from "classnames";
import "./Menu.scss";
const $ = window.$;

class MenuItem extends React.Component {

    static propTypes = {
        index: PropTypes.number.isRequired,
        icon: PropTypes.string,
        link: PropTypes.string,
        target: PropTypes.string,
        onClick: PropTypes.func,
        label: PropTypes.string,
        level: PropTypes.number.isRequired,
        items: PropTypes.array,
        divider: PropTypes.bool
    };

    static defaultProps = {
        divider: false,
        target: ""
    };

    static contextTypes = {
        router: PropTypes.object.isRequired,
        menuComponent: PropTypes.object.isRequired,
        parentMenuList: PropTypes.object.isRequired,
        rootMenuList: PropTypes.object.isRequired,
    };

    constructor(props){
        super(props);
        this.state = {
            open: false
        };
    }

    toggleOpen(){
        if(this.state.open) this.close();
        else this.open();
    }

    open(){
        this.setState({ open: true });

        if(this.context.parentMenuList.selectedMenuItem){
            this.context.parentMenuList.selectedMenuItem.close();
        }

        this.context.parentMenuList.selectedMenuItem = this;
    }

    close(){
        this.setState({ open: false });

        // Close sub menu selected item
        if(this.refs.subMenuList && this.refs.subMenuList.selectedMenuItem){
            this.refs.subMenuList.selectedMenuItem.close();
        }

        this.context.parentMenuList.selectedMenuItem = null;
    }

    @autobind
    handleClick(e){
        e.preventDefault();
        this.context.menuComponent.itemClick(this.props).then(() => {
            if(this.props.items){
                this.toggleOpen();
            } else if(this.props.link && this.context.rootMenuList.selectedMenuItem) {
                this.context.rootMenuList.selectedMenuItem.close();
            }

        });
    }

    render() {
        // Divider
        if(this.props.divider){
            return <li className="divider" />
        } else {
            // Menu item
            const level = this.props.level;
            const icon = (this.props.icon) ? <em className={"fa fa-lg fa-" + this.props.icon}/> : null;
            let menuItem = (
                <a onClick={this.handleClick}>
                    {icon} {this.props.label} { (level === 1 && this.props.items) && <span className="caret"/>  }
                </a>
            );
            const className = classNames({
                active: this.props.link && this.context.router.route.location.pathname === this.props.link,
                open: this.props.level === 1 && this.state.open,
                selected: this.state.selected,
                'dropdown-submenu' : (this.props.level > 1 && this.props.items)
            });
            return (
                <li className={className}>
                    {menuItem}
                    {this.props.items && <MenuList ref="subMenuList" items={this.props.items} level={level + 1} visible={this.state.open} /> }
                </li>
            )
        }
    }
}


class MenuList extends React.Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        level: PropTypes.number,
        visible: PropTypes.bool,
        className: PropTypes.string
    };

    static defaultProps = {
        level: 1,
        visible: true
    };

    static contextTypes = {
        parentMenuList: PropTypes.object,
        rootMenuList: PropTypes.object
    };

    static childContextTypes = {
        parentMenuList: PropTypes.object.isRequired,
        rootMenuList: PropTypes.object.isRequired,
    };

    getChildContext() {
        const root = (this.context.rootMenuList === undefined) ? this : this.context.rootMenuList;
        return {
            rootMenuList: root,
            parentMenuList: this
        };
    }

    constructor(props){
        super(props);
        this.selectedMenuItem = null;
    }

    render() {
        const className = classNames(
            "menu-level-" + this.props.level,
            this.props.className,
            {
                'multi-level': (this.props.level === 2),
                'dropdown-menu' : (this.props.level >= 2)
            }
        );
        return (
            <ul className={className}>
                {this.props.items && this.props.items.map((item, i) => (
                    <MenuItem key={i} index={i} {...item} level={this.props.level}/>
                ))}
            </ul>
        )
    }
}


export default class Menu extends Component {

    static propTypes = Object.assign({}, Component.propTypes, {
        items: PropTypes.array,
        className: PropTypes.string
    });

    static defaultProps = Object.assign({}, Component.defaultProps,{
        items: [],
        level: 1
    });

    static contextTypes = Object.assign({}, Component.contextTypes, {
        router: PropTypes.object.isRequired,
    });

    static childContextTypes = Object.assign({}, Component.childContextTypes, {
        menuComponent: PropTypes.object.isRequired,
    });

    /**
     * Attribute: items
     * @returns {*}
     */
    get items() {
        return this.getAttributeValue('items', this.props.items);
    }

    set items(value) {
        this.setAttributeValue('items', value);
    }

    getAttributesLinkedToProps(){
        return super.getAttributesLinkedToProps().concat([
            'items'
        ]);
    }

    getChildContext() {
        return {
            menuComponent: this
        };
    }

    static bundleName = 'React';

    eventList() {
        return ['itemClick']
    }

    itemClick(item){
        const basename = (window.location.pathname.startsWith('/app_dev.php')) ? '/app_dev.php' : '';
        return this.fireEvent('itemClick', item).then(() => {
            if(item.onClick){
                if(this.refs.MenuList.selectedMenuItem)
                    this.refs.MenuList.selectedMenuItem.close();
                item.onClick(item);
            } else if(item.link){
                if(item.target){
                    // Use window open
                    window.open(basename + item.link, item.target);
                } else {
                    // Use react history API
                    this.context.router.history.push(item.link);
                }
            }
        });
    }

    setItems(items){
        this.setState({
            items: items
        });
    }

    /**
     * Get items
     * @returns {Array}
     */
    getItems()
    {
        return this.items;
    }

    @autobind
    handleClickOutside(e) {
        // If click on menu item children
        if ($(e.target).parents().is(ReactDOM.findDOMNode(this.refs.MenuList))) {
            e.preventDefault();
        } else {
            if (this.refs.MenuList.selectedMenuItem)
                this.refs.MenuList.selectedMenuItem.close();
        }
    }

    componentDidMount() {
        super.componentDidMount();
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        document.removeEventListener('mousedown', this.handleClickOutside);
    }


    render() {
        const className = classNames(
            "menu-component", this.props.className
        );
        return (
            <MenuList ref="MenuList" className={className} items={this.getItems()} level={1} />
        )
    }
}
