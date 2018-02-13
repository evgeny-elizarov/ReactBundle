import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ExampleForm from "@AndevisReactBundle/UI/Views/ExampleForm/ExampleForm";
import ExampleGrid from "@AndevisReactBundle/UI/Views/ExampleGrid/ExampleGrid";
import ExampleComponents from "@AndevisReactBundle/UI/Views/ExampleComponents/ExampleComponents";
import Menu from "@AndevisReactBundle/UI/Components/Menu/Menu";
import ExampleComponentsArray from "@AndevisReactBundle/UI/Views/ExampleComponentsArray/ExampleComponentsArray";

export default (props) => (
    <div className="examples">
        <nav className="navbar navbar-inverse">
            <div className="container">
                <div id="navbar" className="navbar-collapse collapse">
                    <Menu
                        className="nav navbar-nav"
                        items={[
                            {
                                label: 'Form',
                                link: '/react/example/form',
                            },
                            {
                                label: 'Grid',
                                link: '/react/example/grid',
                            },
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
                <Route path='/react/example/form' component={ExampleForm}/>
                <Route path='/react/example/grid' component={ExampleGrid}/>
                <Route path='/react/example/component' component={ExampleComponents}/>
                <Route path='/react/example/component-array' component={ExampleComponentsArray}/>
            </Switch>
        </div>
    </div>
);