import React from "react";
import {Table} from "../../../server/src/types/types";
import {zoneNames} from "../utils/tables";
import axios from "axios";

export const TableInfo: React.FC<{ table: Table }> = ({table}) => {
    return <div>
        <h3>Столик №{table.id}</h3>
        <p>Количество мест -- {table.chair_count}</p>
        <p>Зона -- {zoneNames[table.zone]}</p>
        <button onClick={() =>}>Забронировать
        </button>
        <br/>
        <br/>
    </div>
}