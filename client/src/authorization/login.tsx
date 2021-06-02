import React, {useState} from "react";
import axios from "axios";
import {useToken} from "../hooks/useToken";
import {Redirect} from 'react-router-dom'

export const Login: React.FC<{
    token: string | null,
    setToken: (token: string) => void
}> = ({token, setToken}) => {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    if (token) return <Redirect to={'/'}/>
    return (
        <form onSubmit={e => {
            e.preventDefault()
            axios.get('http://localhost:3001/login', {params: {phone, password}})
                .then(({data}) => setToken(data.token))
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