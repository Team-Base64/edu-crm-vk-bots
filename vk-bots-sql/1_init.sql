create type bot_type as enum ('M', 'S');

create table vk_bots (
    id serial primary key ,
    token varchar not null ,
    vk_group_id serial not null,
    bot_type bot_type not null
);

create table link_user_student
(
    vk_user_id serial not null ,
    student_id serial not null ,
        unique(vk_user_id, student_id)
);

create table link_user_bot_chat (
    vk_user_id serial not null ,
    vk_group_id serial not null ,
    internal_chat_id serial not null,
    class_id serial not null,
    unique (vk_group_id, vk_user_id, internal_chat_id)
);

