import React, {useState} from "react";
import {Registration} from "./authorization/registration";
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {Dashboard} from "./authorization/dashboard";
import {useToken} from "./hooks/useToken";
import {Login} from "./authorization/login";
import {Tables} from "./tables/tables";

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
                <Route path={'/tables'}>
                    <Tables/>
                </Route>
                <Route path={'/'}>
                    <Dashboard/>
                </Route>
            </Switch>
            <Link onClick={() => setToken('')} to={'/'}>Выйти</Link>
        </BrowserRouter>
    </div>
}