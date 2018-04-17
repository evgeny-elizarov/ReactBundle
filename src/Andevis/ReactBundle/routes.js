import React from './react';
import { Switch, Route } from 'react-router-dom';
import Examples from "./UI/Views/Examples";

const ReactRoutes = () => (
    <Switch>
        { process.env.NODE_ENV !== 'production' &&
            <Route path='/react/example' component={Examples}/>
        }
    </Switch>
);

export default ReactRoutes;