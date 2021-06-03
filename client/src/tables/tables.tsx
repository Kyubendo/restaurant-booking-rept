import React, {useEffect, useState} from "react";
import axios from "axios";
import {Table} from "../../../server/src/types/types";
import {TableInfo} from "./table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useUserAuth} from "../hooks/useUserAuth";

export const Tables: React.FC = () => {
    const [tables, setTables] = useState<Table[] | null>([])
    const [dateTime, setDatetime] = useState<Date>(new Date());
    const [token] = useUserAuth()
    const handleRequest = (tableId: number) => axios.post(
        'http://localhost:3001/request',
        {tableId, dateTime: dayjs(dateTime).format('YYYY-MM-DD HH:mm')},
        {headers: {'Authorization': token}},
    )
        .catch(e => console.log(e.response))

    useEffect(() => {
        axios.get<Table[]>('http://localhost:3001/tables', {
            params: {
                time: dayjs(dateTime).format('YYYY-MM-DD HH:mm')
            }
        })
            .then(({data}) => setTables(data))
            .catch(e => console.log(e.response))
    }, [dateTime])

    return <div>
        <DatePicker selected={dateTime} onChange={d => setDatetime(d as Date)}
                    showTimeSelect dateFormat="P HH:mm" timeFormat={'HH:mm'}/>
        {tables && tables.map(i => <TableInfo key={i.id} table={i} handleRequest={handleRequest}/>)}
    </div>
}