import React, {useState} from 'react';
import {Link} from "react-router-dom";
import axios from 'axios'
import {UserAuth} from "../../../server/src/types/types";

export const Registration: React.FC<{ setAuth: (auth: UserAuth) => void }> = ({setAuth}) => {
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault()
                axios.get('http://localhost:3001/registration', {params: {phone, name, password}})
                    .then(({data}) => setAuth(data))
                    .catch(e => console.log(e.response))
            }}>
                <label>
                    <p>Имя</p>
                    <input value={name} type="text" onChange={e => setName(e.target.value)}/>
                </label>
                <label>
                    <p>Телефон</p>
                    <input value={phone} type="text" onChange={e => setPhone(e.target.value)}/>
                </label>
                <label>
                    <p>Пароль</p>
                    <input value={password} type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Зарегистрироваться</button>
                </div>
            </form>
            <Link to={'/login'}>Я уже зарегистрирован</Link>
        </div>
    )
}