import {useState} from "react";

export const useToken = () => {
    const getToken = () => sessionStorage.getItem('token')
    const saveToken = (token: string) => {
        sessionStorage.setItem('token', token);
        setToken(token)
    }
    const [token, setToken] = useState(getToken())
    return [token, saveToken] as const
}