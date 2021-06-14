import React from "react";
import {Registration} from "./client/registration";
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import {Dashboard} from "./main/dashboard";
import {useUserAuth} from "./hooks/useUserAuth";
import {Login} from "./main/login";
import {Tables} from "./client/tables";
import {Requests} from "./admin/requests";
import {StatusesInfo} from "./client/statusesInfo";
import './App.css'
import {Report} from "./admin/report";

export const App: React.FC<{}> = () => {
    const [userAuth, saveAuth] = useUserAuth()

    if (!userAuth.token) {
        return <BrowserRouter>
            <Switch>
                <Route path='/login'>
                    <Login token={userAuth.token} setAuth={saveAuth}/>
                </Route>
                <Route path='/'>
                    <Registration setAuth={saveAuth}/>
                </Route>
            </Switch>
        </BrowserRouter>
    }
    return <div>
        <h1>Kamigakari</h1>
        <BrowserRouter>
            <Switch>
                <Route path='/tables'>
                    <Tables/>
                </Route>
                <Route path='/requests'>
                    <Requests/>
                </Route>
                <Route path='/status'>
                    <StatusesInfo/>
                </Route>
                <Route path='/report'>
                    <Report/>
                </Route>
                <Route exact path='/'>
                    <Dashboard/>
                </Route>
                <Route path='/'>
                    <Redirect to='/'/>
                </Route>
            </Switch>
            {window.location.href === '/' && <Link to='/'>Главная</Link>}
            <br/>
            {window.location.href === '/report' &&
            <Link onClick={() => saveAuth({...userAuth, token: ''})} to='/'>Выйти</Link>}
        </BrowserRouter>
    </div>
}