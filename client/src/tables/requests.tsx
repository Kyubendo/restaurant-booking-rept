import React, {useEffect, useState} from "react";
import {Request} from "../../../server/src/types/types";
import axios from "axios";
import {useUserAuth} from "../hooks/useUserAuth";


export const Requests: React.FC = () => {
    const [auth] = useUserAuth()
    const [requests, setRequests] = useState<Request[]>([])
    useEffect(() => {
        axios.get('http://localhost:3001/requests', {headers: {Authorization: auth.token}})
            .then(({data}) => setRequests(data))
            .catch(e => console.log(e.response))
    }, [])
    console.log(requests)
    return <div>
    </div>
}