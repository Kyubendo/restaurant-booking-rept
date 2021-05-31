import React, { useState } from "react";
import {Login} from "./forms/registration";
import {BrowserRouter, Route, Switch} from 'react-router-dom';

export const App: React.FC<{}> = () => {
    const [token, setToken] = useState('')
    if(!token) {
        return <Login setToken={setToken} />
    }
    return <div>
        <h1>kek</h1>
        <BrowserRouter>
            <Switch>
                <Route path={'/login'}>
                    <Login setToken={setToken}/>
                </Route>
            </Switch>
        </BrowserRouter>
    </div>
}