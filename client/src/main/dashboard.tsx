import React from "react";
import {Link} from "react-router-dom";
import {useUserAuth} from "../hooks/useUserAuth";

export const Dashboard: React.FC = () => {
    const [auth] = useUserAuth()
    return <div>
        <h2>Главная страница</h2>
        {auth.role === 'admin'
            ? <>
                <Link to='/requests'>Просмотреть заказы</Link>
                <Link to='/'>Згенерировать отчёт по текущим заказам</Link>
            </>
            : <>
                <Link to='/tables'>Забронировать столик</Link>
                <br/>
                <Link to='/status'>Проверить статус моего бронирования</Link>
            </>
        }
    </div>
}