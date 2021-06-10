import React from "react";
import dayjs from "dayjs";
import {requestStatusNames} from "../utils/nameMap";
import {TablesStatusInfo} from "../../../server/src/types/types";

export const StatusInfo: React.FC<{ tableStatusInfo: TablesStatusInfo, handleCancel: (requestId: number) => void }> =
    ({tableStatusInfo, handleCancel}) => {
        return <div>
            <form onSubmit={e => {
                e.preventDefault()
                handleCancel(tableStatusInfo.id)
            }}>
                <h3>Столик №{tableStatusInfo.request_id}</h3>
                <p>Время — {dayjs(tableStatusInfo.time).format('DD.MM.YYYY HH:mm')}</p>
                <p>Статус — {requestStatusNames[tableStatusInfo.status]}</p>
                {['pending', 'processing'].includes(tableStatusInfo.status) && <button type="submit">Отменить</button>}
                <br/>
            </form>
        </div>
    }