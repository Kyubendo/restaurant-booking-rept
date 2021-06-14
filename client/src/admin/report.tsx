import React, {useEffect, useState} from "react";
import axios from "axios";
import {zoneNames} from "../utils/nameMap";
import {ReportRow} from "../../../server/src/types/types";
import dayjs from "dayjs";
import {useUserAuth} from "../hooks/useUserAuth";


export const Report: React.FC = () => {
    const [data, setData] = useState<ReportRow[]>([])
    const [auth] = useUserAuth()
    useEffect(() => {
        axios.get('http://localhost:3001/report', {headers: {Authorization: auth.token}})
            .then(({data}) => setData(data))
    }, [])
    return <div>
        <table>
            <tr>
                <th>№ Столика</th>
                <th>Зона</th>
                <th>Время</th>
                <th>Имя клиента</th>
                <th>Количество мест</th>
            </tr>
            {(data).map(i => <tr>
                <td>{i.table_id}</td>
                <td>{zoneNames[i.zone]}</td>
                <td>{dayjs(i.time).format('DD.MM.YYYY, HH:mm')}</td>
                <td>{i.name}</td>
                <td>{i.max_chair_count}</td>
            </tr>)}
        </table>
    </div>
}