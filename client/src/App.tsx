import React, {useState} from "react";
import {Registration} from "./forms/registration";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Dashboard} from "./forms/dashboard";
import {useToken} from "./hooks/useToken";
import {Login} from "./forms/login";


export const App: React.FC<{}> = () => {
    const [token, setToken] = useToken()

    if (!token) {
        return <BrowserRouter>
            <Switch>
                <Route path={'/login'}>
                    <Login token={token} setToken={setToken}/>
                </Route>
                <Route path={'/'}>
                    <Registration setToken={setToken}/>
                </Route>
            </Switch>
        </BrowserRouter>
    }
    return <div>
        <h1>kek</h1>
        <BrowserRouter>
            <Switch>
                <Route path={'/'}>
                    <Dashboard/>
                </Route>
            </Switch>
        </BrowserRouter>
        <a onClick={() => setToken('')}>Выйти</a>
    </div>
}