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
    unique (vk_group_id, vk_user_id, internal_chat_id)
);

-- Fill bots
insert into vk_bots(token, vk_group_id, bot_type)
values ('vk1.a.57GCtumfsJopXwIwKVCK264ie4KBSnm6YQw7VH-hbAqw_AF7kZmcvlu6yTW4HSkF2Wd8Ig5apTphiVuBQcS_ueYyqufEKiNHXQFVeiAE8kkRS6Wf95F--GZ0LBKST_rGKNO53xTUhBpVQtE95W2kpR1Lut5eM3YTk8_NaENeH0PYHk-5fcS_iMHDLQ34Kb2hetcJYkM_5psiKSsB6P2cAg',
        222973424, 'S');

insert into vk_bots(token, vk_group_id, bot_type)
values ('vk1.a.B81kRmCSpy504B9qn0qoHlPl3u3O7sifkZYW38qA2zFKH_V5voqinqM8acfB-NAHiJhv8VDpgawO7TzSJHJlsZMN7jXRe9sVoAUcJsZcEeL_SS5qXxnlmqeBPRfCaRWhjMjanUkF1DEO6EG57Efj-7uX7aydWUXhSN2Xo2Fx6aPzw28KZxKxKtu9AOZxjHfuJl-5S_lfXUUVCtXT0y93Xg',
        223136826, 'S');

insert into vk_bots(token, vk_group_id, bot_type)
values ('vk1.a.LHOzBXgnXvdM8uDvXatyjDhHjkQz-hJJ6H4Ui911siwcqOCcOyF6ntApw8BWY3of6tqb0mmlfHZQVuuZfdAWD5tulGHmteDnPnrjf0a7OWLxlHiw7WeUuqm0Rgw2BUsRswUCdQRybIK1LAoK9Rhh3q2grv4t5R9wJpdsI5PBbP_PnEUFYZRrNOdzyN6d0TM9iMeRl7_mWP9LCCXrJoTe4A',
        222976710, 'M');

