import React, {Dispatch, useReducer, useState} from 'react';
import axios from 'axios'
import {Simulate} from "react-dom/test-utils";

type Credentials = {
    name: string,
    phone: string,
    password: string,
}

export const Login: React.FC<{ setToken: Dispatch<string> }> = ({setToken}) => {
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    return (
        <form>
            <label>
                <p>Name</p>
                <input value={name} type="text" onChange={e => setName(e.target.value)}/>
            </label>
            <label>
                <p>Phone</p>
                <input value={phone} type="text" onChange={e => setPhone(e.target.value)}/>
            </label>
            <label>
                <p>Password</p>
                <input value={password} type="password" onChange={e => setPassword(e.target.value)}/>
            </label>
            <div>
                <button onClick={() => {
                    console.log('asdasdasd');
                    console.log('as1d')
                    axios.get('http://localhost:3000/registration', {params: {phone, name, password}})
                        .then(({data}) => {
                            setToken(data.token)
                        })
                }}
                        type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}