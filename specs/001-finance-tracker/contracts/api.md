# Контракт API

Базовый префикс: /api
Аутентификация: заголовок Authorization: Bearer <token>

## Конверт ответа

Успех:
{ "data": <полезная нагрузка> }

Ошибка:
{ "error": { "code": "STRING", "message": "STRING", "details": <необязательно> } }

## Коды ошибок

| HTTP | code | Ситуация |
|---|---|---|
| 400 | BAD_REQUEST | нарушение схемы валидации |
| 401 | UNAUTHORIZED | нет токена, истёк, неверные учётные данные |
| 403 | FORBIDDEN | доступ к чужому ресурсу |
| 404 | NOT_FOUND | ресурс или маршрут не найден |
| 409 | CONFLICT | конфликт уникальности |
| 413 | PAYLOAD_TOO_LARGE | превышен размер тела |
| 500 | INTERNAL_ERROR | необработанное исключение |

## Эндпоинты

| Метод | Путь | Назначение | Требование | Статус |
|---|---|---|---|---|
| GET | /health | проверка живости | NFR-005 | готово |
| POST | /auth/register | регистрация | US-01 | готово |
| POST | /auth/login | вход, выдача токена | FR-016 | готово |
| GET | /auth/me | восстановление сессии | FR-020 | запланировано |
| GET | /settings | чтение настроек | FR-002, FR-017, FR-018 | запланировано |
| PATCH | /settings | изменение настроек | FR-019 | запланировано |
| GET | /accounts | список счетов с балансом | FR-024 | запланировано |
| POST | /accounts | создание счёта | FR-024 | запланировано |
| PATCH | /accounts/:id | изменение счёта | FR-024 | запланировано |
| DELETE | /accounts/:id | удаление счёта | FR-024 | запланировано |
| GET | /categories | список категорий | FR-009 | запланировано |
| POST | /categories | создание категории | FR-009 | запланировано |
| PATCH | /categories/:id | изменение категории | FR-009 | запланировано |
| DELETE | /categories/:id | удаление категории | BR-005 | запланировано |
| GET | /transactions | список с фильтрами и пагинацией | FR-006, FR-007, FR-023 | запланировано |
| POST | /transactions | создание операции | FR-008 | запланировано |
| PATCH | /transactions/:id | изменение операции | FR-008 | запланировано |
| DELETE | /transactions/:id | удаление операции | FR-008 | запланировано |
| POST | /transfers | перевод между счетами | FR-025 | запланировано |
| GET | /budgets | лимиты с прогрессом | FR-010, FR-011, FR-012 | запланировано |
| POST | /budgets | установка лимита | FR-010 | запланировано |
| DELETE | /budgets/:id | снятие лимита | FR-010 | запланировано |
| GET | /stats/summary | агрегаты для диаграмм | FR-003, FR-004 | запланировано |
| GET | /stats/forecast | прогноз на следующий месяц | FR-014 | запланировано |
| POST | /import/csv | импорт операций | FR-013 | запланировано |
| GET | /export/csv | экспорт отфильтрованных | FR-026 | запланировано |
| GET | /reports | сохранённые отчёты | FR-021 | запланировано |
| POST | /reports | сохранение отчёта | FR-021 | запланировано |
| DELETE | /reports/:id | удаление отчёта | FR-021 | запланировано |
| GET | /recurring | шаблоны платежей | FR-022 | запланировано |
| POST | /recurring | создание шаблона | FR-022 | запланировано |
| PATCH | /recurring/:id | изменение шаблона | FR-022 | запланировано |
| DELETE | /recurring/:id | удаление шаблона | FR-022 | запланировано |
| POST | /recurring/:id/apply | применение шаблона | FR-022 | запланировано |

## Примеры

### POST /auth/register
Запрос:
{ "email": "ivan@mail.ru", "password": "superpass123", "name": "Ivan" }

Ответ 201:
{ "data": { "id": 1, "email": "ivan@mail.ru", "name": "Ivan", "created_at": "2026-11-27 10:00:00", "updated_at": "2026-11-27 10:00:00" } }

Ответ 409:
{ "error": { "code": "CONFLICT", "message": "Пользователь с таким email уже зарегистрирован" } }

### POST /auth/login
Запрос:
{ "email": "ivan@mail.ru", "password": "superpass123" }

Ответ 200:
{ "data": { "token": "eyJ...", "user": { "id": 1, "email": "ivan@mail.ru", "name": "Ivan" } } }

Ответ 401:
{ "error": { "code": "UNAUTHORIZED", "message": "Неверный email или пароль" } }

### GET /transactions
Параметры: from, to, type, category_id, account_id, q, page, limit
Сортировка: date DESC, id DESC

Ответ 200:
{ "data": { "items": [ { "id": 12, "date": "2026-11-26", "type": "expense", "amount": 125000, "currency": "RUB", "category": { "id": 3, "name": "Продукты" }, "account": { "id": 1, "name": "Карта" }, "title": "Пятёрочка", "comment": null } ], "total": 148, "page": 1, "limit": 20 } }

### GET /budgets
Ответ 200:
{ "data": [ { "id": 2, "category": { "id": 3, "name": "Продукты" }, "period": "2026-11", "limit_amount": 2000000, "spent_amount": 1740000, "progress": 0.87, "state": "warning" } ] }

Значения state: ok при progress < 0.8, warning при 0.8 <= progress < 1, exceeded при progress >= 1.

### GET /stats/summary
Параметры: from, to, group_by (category | day | month)
Ответ 200:
{ "data": { "currency": "RUB", "income": 9000000, "expense": 5400000, "by_category": [ { "category_id": 3, "name": "Продукты", "amount": 1740000 } ], "by_period": [ { "period": "2026-11-01", "income": 0, "expense": 125000 } ] } }

Переводы в income и expense не включаются.

### GET /stats/forecast
Ответ 200:
{ "data": { "month": "2026-12", "method": "median", "months_used": 3, "total": 5300000, "by_category": [ { "category_id": 3, "name": "Продукты", "amount": 1700000 } ] } }

### POST /import/csv
Ответ 200:
{ "data": { "imported": 142, "skipped": 3, "errors": [ { "line": 17, "reason": "Неизвестная категория" } ] } }

### Формат CSV
Заголовок: date,type,amount,currency,category,account,title,comment
Пример строки: 2026-11-26,expense,1250.00,RUB,Продукты,Карта,Пятёрочка,

## Пагинация и лимиты

page по умолчанию 1, limit по умолчанию 20, максимум 100.
Размер тела запроса ограничен 1 МБ, для CSV — 5 МБ.