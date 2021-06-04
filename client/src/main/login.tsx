import React, {useState} from "react";
import axios from "axios";
import {Redirect} from 'react-router-dom'
import {UserAuth} from "../../../server/src/types/types";

export const Login: React.FC<{
    token: string | null,
    setAuth: (auth: UserAuth) => void
}> = ({token, setAuth}) => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    if (token) return <Redirect to={'/'}/>
    return (
        <form onSubmit={e => {
            e.preventDefault()
            axios.get('http://localhost:3001/login', {params: {phone, password}})
                .then(({data}) => setAuth(data))
                .catch(e => console.log(e.response))
        }}>
            <label>
                <p>Телефон</p>
                <input value={phone} type="text" onChange={e => setPhone(e.target.value)}/>
            </label>
            <label>
                <p>Пароль</p>
                <input value={password} type="password" onChange={e => setPassword(e.target.value)}/>
            </label>
            <div>
                <button type="submit">Войти</button>
            </div>
        </form>
    )
}