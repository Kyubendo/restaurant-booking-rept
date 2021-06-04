import React, {useEffect, useReducer} from "react";
import {Request, RequestStatus} from "../../../server/src/types/types";
import axios from "axios";
import {useUserAuth} from "../hooks/useUserAuth";
import {RequestInfo} from "./requestInfo";

type State = {
    requests: Request[],
    loading: boolean,
}

type Action = ActionRequests | ActionRefresh

class ActionRequests {
    public readonly type = 'setRequests'

    constructor(public readonly requests: Request[]) {
    }
}

class ActionRefresh {
    public readonly type = 'refresh'
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "refresh":
            return {...state, loading: true}
        case "setRequests":
            return {...state, requests: action.requests, loading: false}
    }
}

const initialState: State = {
    requests: [],
    loading: true,
}

export const Requests: React.FC = () => {
    const [auth] = useUserAuth()
    const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState)
    const handleStatusChange = (requestId: number, status: Exclude<RequestStatus, 'pending'>) => {
        axios.patch('http://localhost:3001/request',
            {status, requestId},
            {headers: {Authorization: auth.token}})
            .then(() => dispatch(new ActionRefresh()))
            .catch(e => console.log(e.response))
    }
    useEffect(() => {
        if (!state.loading) return
        axios.get('http://localhost:3001/requests', {headers: {Authorization: auth.token}})
            .then(({data}) => dispatch(new ActionRequests(Object.values(data))))
            .catch(e => console.log(e.response))
    }, [state.loading, auth.token])

    return <div>
        {!state.loading
            ? state.requests.map(i =>
                <RequestInfo request={i} changeStatus={(status) => handleStatusChange(i.id, status)}/>)
            : 'Loading..'}
    </div>
}