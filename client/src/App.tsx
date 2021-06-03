import React, {useState} from "react";
import {Registration} from "./authorization/registration";
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {Dashboard} from "./authorization/dashboard";
import {useUserAuth} from "./hooks/useUserAuth";
import {Login} from "./authorization/login";
import {Tables} from "./tables/tables";

export const App: React.FC<{}> = () => {
    const [userAuth, saveAuth] = useUserAuth()

    if (!userAuth.token) {
        return <BrowserRouter>
            <Switch>
                <Route path={'/login'}>
                    <Login token={userAuth.token} setAuth={saveAuth}/>
                </Route>
                <Route path={'/'}>
                    <Registration setAuth={saveAuth}/>
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
                <Route path={'/requests'}>

                </Route>
                <Route path={'/'}>
                    <Dashboard/>
                </Route>
            </Switch>
            <Link onClick={() => saveAuth({...userAuth, token: ''})} to={'/'}>Выйти</Link>
        </BrowserRouter>
    </div>
}