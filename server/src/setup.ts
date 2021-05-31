import {getConnection} from "./dbConnection";

export const database = () => {
    const db = getConnection()
    db.query(
        `do
        $$
            begin
                create type table_zone as enum ('common','children','smoking');
            exception
                when duplicate_object then null;
            end
        $$;
        
        do
        $$
            begin
                create type request_status as enum ('pending', 'processing','accepted', 'rejected');
            exception
                when duplicate_object then null;
            end
        $$;
        
        do
        $$
            begin
                create type user_role as enum ('client', 'admin');
            exception
                when duplicate_object then null;
            end
        $$;`
    )

    db.query(
        `create table if not exists "user"
         (
             id       serial primary key,
             phone    varchar(12) not null,
             name     text        not null,
             password text        not null,
             role     user_role   not null
         );

        create table if not exists "table"
        (
            id          serial primary key,
            chair_count int        not null,
            zone        table_zone not null
        );

        create table if not exists request
        (
            id       serial primary key,
            user_id  int references "user" (id)  not null,
            table_id int references "table" (id) not null,
            time     timestamp                   not null,
            status   request_status              not null
        );`
    )

}