import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ExampleForm from "./ExampleForm/ExampleForm";
import ExampleGrid from "./ExampleGrid/ExampleGrid";
import ExampleComponents from "./ExampleComponents/ExampleComponents";
import ExampleComponentsArray from "./ExampleComponentsArray/ExampleComponentsArray";
import ExampleMsgBox from './ExampleMsgBox/ExampleMsgBox';
import ExampleDataTable from './ExampleDataTable/ExampleDataTable';
import ExampleTabs from './ExampleTabs/ExampleTabs';
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
                                label: 'Data Table',
                                link: '/react/example/data-table',
                            },
                            {
                                label: 'MsgBox',
                                link: '/react/example/msg-box',
                            },
                            {
                                label: 'Form',
                                link: '/react/example/form',
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
                            }
                        ]}
                    />
                </div>
            </div>
        </nav>
        <div className="container">
            <Switch>
                <Route path='/react/example/data-table' component={ExampleDataTable}/>
                <Route path='/react/example/form' component={ExampleForm}/>
                <Route path='/react/example/tabs' component={ExampleTabs}/>
                {/*<Route path='/react/example/grid' component={ExampleGrid}/>*/}
                <Route path='/react/example/component' component={ExampleComponents}/>
                <Route path='/react/example/component-array' component={ExampleComponentsArray}/>
                <Route path='/react/example/msg-box' component={ExampleMsgBox}/>
            </Switch>
        </div>
    </div>
);