import React from "react";
import {Link} from "react-router-dom";

export const Dashboard: React.FC = () => {
    return <div>
        <h2>Dashboard</h2>
        <Link to={'/tables'}>Забронировать столик</Link>
    </div>
}