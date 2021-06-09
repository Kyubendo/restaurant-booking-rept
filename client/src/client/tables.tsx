import React, {useEffect, useReducer, useState} from "react";
import axios from "axios";
import {Table} from "../../../server/src/types/types";
import {TableInfo} from "./table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useUserAuth} from "../hooks/useUserAuth";

type State = {
    tables: Table[] | null,
    date: Date,
    loading: boolean
}

type  Action = ActionTables | ActionRefresh | ActionDate

class ActionTables {
    public readonly type = 'setTables'

    constructor(public readonly tables: Table[]) {
    }
}

class ActionRefresh {
    public readonly type = 'refresh'
}

class ActionDate {
    public readonly type = 'setDate'

    constructor(public readonly date: Date) {
    }
}

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case "setTables":
            return {...state, tables: action.tables, loading: false}
        case "refresh":
            return {...state, tables: null, loading: true}
        case "setDate":
            return {...state, date: action.date, loading: true}
    }
}

const initialState: State = {
    date: new Date(),
    loading: true,
    tables: null
}

export const Tables: React.FC = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [auth] = useUserAuth()
    const handleRequest = (tableId: number) => axios.post(
        'http://localhost:3001/request',
        {tableId, dateTime: dayjs(state.date).format('YYYY-MM-DD HH:mm')},
        {headers: {'Authorization': auth.token}},
    )
        .then(() => dispatch(new ActionRefresh()))
        .catch(e => console.log(e.response))

    useEffect(() => {
        if (!state.loading) return
        axios.get<Table[]>('http://localhost:3001/tables', {
            params: {
                time: dayjs(state.date).format('YYYY-MM-DD HH:mm')
            }
        })
            .then(({data}) => dispatch(new ActionTables(data)))
            .catch(e => console.log(e.response))
    }, [state.loading])

    return <div>
        <DatePicker selected={state.date} onChange={d => dispatch(new ActionDate(d as Date))}
                    showTimeSelect dateFormat="P HH:mm" timeFormat={'HH:mm'}/>
        {state.tables
            ? (state.tables.length
                ? state.tables.map(i => <TableInfo key={i.id} table={i} handleRequest={handleRequest}/>)
                : 'Свободных столиков на это время нет :(')
            : 'Загрузка...'}
    </div>
}