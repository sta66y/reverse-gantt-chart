create schema if not exists storage;

create table storage.t_user
(
    c_id       serial primary key,
    c_username varchar(512) not null unique,
    c_password varchar(1024) not null
);

