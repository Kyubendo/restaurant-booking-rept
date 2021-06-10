import React, {useEffect, useReducer, useState} from "react";
import axios from "axios";
import {useUserAuth} from "../hooks/useUserAuth";
import {TablesStatusInfo} from "../../../server/src/types/types";
import {StatusInfo} from "./statusInfo";

type State = {
    statusesInfo: TablesStatusInfo[],
    loading: boolean,
}

type Action = ActionRefresh | ActionStatusesInfo

class ActionStatusesInfo {
    public readonly type = 'setStatusesInfo'

    constructor(public readonly statusesInfo: TablesStatusInfo[]) {
    }
}

class ActionRefresh {
    public readonly type = 'refresh'
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "refresh":
            return {...state, loading: true}
        case "setStatusesInfo":
            return {...state, statusesInfo: action.statusesInfo, loading: false}
    }
}
const initialState: State = {
    statusesInfo: [],
    loading: true,
}
export const StatusesInfo: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [auth] = useUserAuth()

    useEffect(() => {
        if (!state.loading) return
        axios.get('http://localhost:3001/statuses', {headers: {Authorization: auth.token}})
            .then(({data}) => dispatch(new ActionStatusesInfo(data)))
            .catch(e => console.log(e.response))
    }, [state.loading])

    const handleCancel = (requestId: number) => {
        axios.patch('http://localhost:3001/cancel-request', {requestId},
            {headers: {Authorization: auth.token},})
            .then(() => dispatch(new ActionRefresh()))
            .catch(e => console.log(e.response))
    }
    return <div>
        {!state.loading
            ? (state.statusesInfo.length
                ? state.statusesInfo.map(i => <StatusInfo handleCancel={handleCancel} tableStatusInfo={i}/>)
                : <p>У вас нет акивных заказов. Вы можете сделать заказ на <a href='/tables'>этой старнице</a></p>)
            : 'Загрузка...'}
    </div>
}
