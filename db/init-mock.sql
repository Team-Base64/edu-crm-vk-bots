-- Mock backend
create table internal_chats
(
    internal_chat_id serial primary key,
    student_id serial not null,
    class_id serial not null
);

create table tokens
(
    token   varchar not null,
    class_id serial not null
);

create table homeworks
(
    id serial primary key,
    class_id serial not null,
    title varchar not null,
    descr varchar,
    attaches varchar[]
);

create type SN as enum ('vk', 'tg');

create table students
(
    id serial primary key,
    name varchar not null,
    avatarURL varchar,
    sn SN not null
);

create table solutions
(
    id serial primary key,
    text varchar,
    attaches varchar[]
);

-- Fill invite tokens
insert into tokens(token, class_id)
values ('123', 1);


insert into tokens(token, class_id)
values ('321', 2);

-- Fill homeworks

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 1', 'descr 1', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 2', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 3', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 4', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 5', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 6', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 7', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 8', 'descr 2', '{}');


insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 9', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (1, 'HW 10', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (2, 'HW 1', 'descr 1', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (2, 'HW 2', 'descr 2', '{}');

insert into homeworks(class_id, title, descr, attaches)
values (2, 'HW 3', 'descr 3', '{}');