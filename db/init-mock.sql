-- Mock backend
create table internal_chats
(
    internal_chat_id serial primary key,
    slug             varchar
);

create table tokens
(
    token   varchar not null,
    expires timestamp
);

-- Fill invite tokens
insert into tokens(token, expires)
values ('123', now());
