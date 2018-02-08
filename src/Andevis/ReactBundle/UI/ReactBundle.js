import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { setBundle } from "./Helpers";
import ExamplesMenu from "./Views/ExamplesMenu";

setBundle('React', () => (
    <Switch>
        { process.env.NODE_ENV !== 'production' &&
            <Route path='/react/example' component={ExamplesMenu}/>
        }
    </Switch>
));