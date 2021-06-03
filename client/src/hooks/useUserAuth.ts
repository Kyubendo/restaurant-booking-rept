import {useState} from "react";
import {UserAuth, UserRole} from "../../../server/src/types/types";

export const useUserAuth = () => {
    const getUserAuth = () => ({
        token: localStorage.getItem('token') || '',
        role: localStorage.getItem('role') as UserRole || 'client',
        name: localStorage.getItem('name') || '',
    })
    const saveUserAuth = (auth: UserAuth) => {
        localStorage.setItem('token', auth.token);
        localStorage.setItem('role', auth.role);
        localStorage.setItem('name', auth.name);
        setUserAuth({...auth})
    }
    const [userAuth, setUserAuth] = useState<UserAuth>(getUserAuth())
    return [userAuth, saveUserAuth] as const
}