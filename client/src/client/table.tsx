import React from "react";
import {Table} from "../../../server/src/types/types";
import {zoneNames} from "../utils/nameMap";

export const TableInfo: React.FC<{ table: Table, handleRequest: (id: number) => void }> = ({table, handleRequest}) => {
    return <div>
        <h3>Столик №{table.id}</h3>
        <p>Размер столика — {table.max_chair_count} мест</p>
        <p>Зона — {zoneNames[table.zone]}</p>
        <button onClick={() => handleRequest(table.id)}>Забронировать
        </button>
        <br/>
        <br/>
    </div>
}