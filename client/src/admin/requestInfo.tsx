import React from "react";
import {Request, RequestStatus} from "../../../server/src/types/types";
import {requestStatusNames} from "../utils/nameMap";
import dayjs from "dayjs";

export const RequestInfo: React.FC<{
    request: Request,
    changeStatus: (status: Exclude<RequestStatus, 'pending'>) => void
}> = ({request, changeStatus}) => {
    return <div>
        <h3>Заявка №{request.id}</h3>
        <p>Столик №{request.table_id}</p>
        <p>Имя клиента — {request.user_name}</p>
        <p>Номер клиента — {request.user_phone}</p>
        <p>Время — {dayjs(request.time).format('DD.MM.YYYY, HH:mm')}</p>
        <p>Статус — {requestStatusNames[request.status]}</p>
        {request.status === 'pending'
            ? <button onClick={() => changeStatus('processing')}>
                Взять в работу
            </button>
            : request.status === 'processing'
            && <>
                <button onClick={() => changeStatus('accepted')}>
                    Принять заказ
                </button>
                <button onClick={() => changeStatus('rejected')}>
                    Отклонить
                </button>
            </>
        }
        <br/>
        <br/>
    </div>
}