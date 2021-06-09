import React, {useEffect, useState} from "react";
import axios from "axios";
import {useUserAuth} from "../hooks/useUserAuth";
import {TablesStatusInfo} from "../../../server/src/types/types";
import dayjs from "dayjs";
import {requestStatusNames} from "../utils/nameMap";

export const StatusInfo: React.FC = () => {
    const [statusesInfo, setStatusesInfo] = useState<TablesStatusInfo[] | null>(null)
    const [auth] = useUserAuth()

    useEffect(() => {
        axios.get('http://localhost:3001/statuses', {headers: {Authorization: auth.token}})
            .then(({data}) => setStatusesInfo(data))
            .catch(e => console.log(e.response))
    }, [])

    return <div>
        {statusesInfo
            ? (statusesInfo.length
                ? statusesInfo.map(i =>
                    <>
                        <h3>Столик №{i.id}</h3>
                        <p>Время — {dayjs(i.time).format('DD.MM.YYYY HH:mm')}</p>
                        <p>Статус — {requestStatusNames[i.status]}</p>
                        <br/>
                    </>)
                : <p>У вас нет акивных заказов. Вы можете сделать заказ на <a href={'/tables'}>этой старнице</a></p>)
            : 'Загрузка...'}
    </div>
}