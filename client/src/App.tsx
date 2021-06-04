import React from "react";
import {Registration} from "./user/registration";
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {Dashboard} from "./main/dashboard";
import {useUserAuth} from "./hooks/useUserAuth";
import {Login} from "./main/login";
import {Tables} from "./user/tables";
import {Requests} from "./admin/requests";

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
                    <Requests/>
                </Route>
                <Route path={'/status'}>

                </Route>
                <Route path={'/'}>
                    <Dashboard/>
                </Route>
            </Switch>
            <Link onClick={() => saveAuth({...userAuth, token: ''})} to={'/'}>Выйти</Link>
        </BrowserRouter>
    </div>
}