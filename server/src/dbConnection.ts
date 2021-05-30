import {Pool} from "pg";

let pool: Pool | null = null;

const connect=():Pool =>{
    return new Pool({
        user: 'postgres',
        host: 'db',
        database: 'restaurant_booking',
        password: 'postgres',
        port: 5432,
    })
}

export const getConnection=():Pool=> {
    console.log(pool)
    if (!pool) pool = connect();
    return pool;
}
