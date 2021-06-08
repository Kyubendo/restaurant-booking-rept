import {getConnection} from "./dbConnection";

export const database = async () => {
    const db = getConnection()

    await db.query(
        `do
        $$
            begin
                create type request_status as enum ('pending', 'processing','accepted', 'rejected');
            exception
                when duplicate_object then null;
            end
        $$;`
    )

    await db.query(
        `create table if not exists "user"
         (
             id       serial primary key,
             phone    varchar(12) unique not null,
             name     text               not null,
             password text               not null,
             token    text               not null
         );

        create table if not exists client
        (
            user_id int references "user" (id) primary key,
            email   text
        );

        create table if not exists admin
        (
            user_id           int references "user" (id) primary key,
            department_number int not null 
        );

        create table if not exists zone
        (
            id              serial primary key,
            name            text unique not null ,
            max_chair_count int not null
        );

        create table if not exists "table"
        (
            id   serial primary key,
            zone_id int references zone (id) not null
        );

        create table if not exists request
        (
            id        serial primary key,
            client_id int references "client" (user_id) not null,
            admin_id  int references "admin" (user_id),
            table_id  int references "table" (id)       not null,
            time      timestamp                         not null,
            status    request_status                    not null
        );`
    )

    await db.query(
        `insert into zone
         values (1, 'common', 4),
                (2, 'children', 6),
                (3, 'smoking', 3)
         on conflict do nothing`
    )
}
