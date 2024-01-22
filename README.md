# Сервис VK ботов

Данный сервис реализует логику работы вконтакте ботов. Выделен master бот для регистрации учеников в классы и slave боты для общения с репетитором.

### Зона ответственности

1. Обмен сообщениями
2. Сценарий отправки решения
3. Сценарий получения списка домашних заданий
4. Сценарий получения списка ближайших занятий
5. Сценарий подключения к классу через код приглашение

### Переменные окружения

`POSTGRES_USER` - имя пользователя для подключения к БД

`POSTGRES_HOST` - хост для подключения к БД

`POSTGRES_PASSWORD` - пароль для подключения к БД

`POSTGRES_PORT` - порт для подключения к БД

`POSTGRES_DB` - имя базы для подключения к БД

`MOCK` - включение/отключение моков

`LOGLEVEL` - уровень логирования

`GRPC_HOST` - хост для подключения к сервису чата по grpc

`GRPC_HOST` - порт для подключения к сервису чата по grpc

---

> Коммит со строкой `[DEPLOY]` в сообщении вызовет workflow для сборки докер-изображения и деплоя на сервер.
