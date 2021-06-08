import React from "react";
import {Link} from "react-router-dom";
import {useUserAuth} from "../hooks/useUserAuth";

export const Dashboard: React.FC = () => {
    const [auth] = useUserAuth()
    return <div>
        <h2>Dashboard</h2>
        {auth.role === 'admin'
            ? <Link to={'/requests'}>Просмотреть заказы</Link>
            : <>
                <Link to={'/tables'}>Забронировать столик</Link>
                <Link to={'/status'}>Проверить статус моего бронирования</Link>
            </>
        }
    </div>
}