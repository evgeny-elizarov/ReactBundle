import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ExampleForm from "./ExampleForm/ExampleForm";
import ExampleFormComponents from "./ExampleFormComponents/ExampleFormComponents";
import ExampleGrid from "./ExampleGrid/ExampleGrid";
import ExampleComponents from "./ExampleComponents/ExampleComponents";
import ExampleContainer from "./ExampleContainer/ExampleContainer";
import ExampleComponentsArray from "./ExampleComponentsArray/ExampleComponentsArray";
import ExampleMsgBox from './ExampleMsgBox/ExampleMsgBox';
import ExampleDataTable from './ExampleDataTable/ExampleDataTable';
import ExampleTabs from './ExampleTabs/ExampleTabs';
import ExampleGlobalState from './ExampleGlobalState/ExampleGlobalState';
import ExampleServerMethod from './ExampleServerMethod/ExampleServerMethod';
import ExampleEvents from './ExampleEvents/ExampleEvents';
import Menu from "@AndevisReactBundle/UI/Components/Menu/Menu";

export default () => (
    <div className="examples">
        <nav className="navbar navbar-inverse">
            <div className="container">
                <div id="navbar" className="navbar-collapse collapse">
                    <Menu
                        className="nav navbar-nav"
                        items={[
                            {
                                label: 'Container',
                                link: '/react/example/container',
                            },
                            {
                                label: 'Data Table',
                                link: '/react/example/data-table',
                            },
                            {
                                label: 'MsgBox',
                                link: '/react/example/msg-box',
                            },
                            {
                                label: 'Form ',
                                link: '/react/example/form',
                            },
                            {
                                label: 'Form components',
                                link: '/react/example/form-components',
                            },
                            {
                                label: 'Tabs',
                                link: '/react/example/tabs',
                            },
                            // {
                            //     label: 'Grid',
                            //     link: '/react/example/grid',
                            // },
                            {
                                label: 'Custom component',
                                link: '/react/example/component',
                            },
                            {
                                label: 'Component array',
                                link: '/react/example/component-array',
                            },
                            {
                                label: 'Global state',
                                link: '/react/example/global-state',
                            },
                            {
                                label: 'Server method',
                                link: '/react/example/server-method',
                            },
                            {
                                label: 'Events',
                                link: '/react/example/events',
                            }
                        ]}
                    />
                </div>
            </div>
        </nav>
        <div className="container">
            <Switch>
                <Route path='/react/example/container' component={ExampleContainer}/>
                <Route path='/react/example/data-table' component={ExampleDataTable}/>
                <Route path='/react/example/form' component={ExampleForm}/>
                <Route path='/react/example/form-components' component={ExampleFormComponents}/>
                <Route path='/react/example/tabs' component={ExampleTabs}/>
                {/*<Route path='/react/example/grid' component={ExampleGrid}/>*/}
                <Route path='/react/example/component' component={ExampleComponents}/>
                <Route path='/react/example/component-array' component={ExampleComponentsArray}/>
                <Route path='/react/example/msg-box' component={ExampleMsgBox}/>
                <Route path='/react/example/global-state' component={ExampleGlobalState}/>
                <Route path='/react/example/server-method' component={ExampleServerMethod}/>
                <Route path='/react/example/events' component={ExampleEvents}/>
            </Switch>
        </div>
    </div>
);