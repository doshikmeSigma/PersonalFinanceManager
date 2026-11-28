# Модель данных

Все суммы — INTEGER в минорных единицах. Все даты — TEXT в UTC.
Каждая пользовательская таблица содержит user_id с внешним ключом на users.

## users
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK AUTOINCREMENT |
| email | TEXT | NOT NULL, UNIQUE, COLLATE NOCASE |
| password_hash | TEXT | NOT NULL |
| name | TEXT | NOT NULL, непустое |
| created_at | TEXT | NOT NULL, default now |
| updated_at | TEXT | NOT NULL, default now |

Статус: реализовано, миграция 001_users.sql

## user_settings
| Поле | Тип | Ограничения |
|---|---|---|
| user_id | INTEGER | PK, FK users ON DELETE CASCADE |
| base_currency | TEXT | RUB, USD, EUR, default RUB |
| theme | TEXT | light, dark, default light |
| filters_json | TEXT | последние применённые фильтры |
| updated_at | TEXT | NOT NULL |

Покрывает: FR-002, FR-017, FR-018, FR-019

## accounts
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK |
| user_id | INTEGER | FK users |
| name | TEXT | NOT NULL |
| currency | TEXT | RUB, USD, EUR |
| kind | TEXT | cash, card, savings |
| initial_balance | INTEGER | default 0 |
| archived | INTEGER | 0 или 1 |

Покрывает: FR-024. Баланс вычисляемый, не хранимый.

## categories
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK |
| user_id | INTEGER | FK users |
| name | TEXT | NOT NULL |
| type | TEXT | income, expense |
| color | TEXT | hex |
| icon | TEXT | необязательно |

Уникальность (user_id, name, type). Покрывает FR-009, BR-004, BR-005.

## transactions
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK |
| user_id | INTEGER | FK users |
| account_id | INTEGER | FK accounts |
| target_account_id | INTEGER | FK accounts, только для transfer |
| category_id | INTEGER | FK categories, NULL для transfer |
| type | TEXT | income, expense, transfer |
| amount | INTEGER | > 0 |
| currency | TEXT | RUB, USD, EUR |
| date | TEXT | дата операции |
| comment | TEXT | необязательно |
| title | TEXT | название операции |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |

Индексы: (user_id, date DESC), (user_id, category_id), (user_id, account_id).
Покрывает: FR-005, FR-006, FR-007, FR-008, FR-023, FR-025.

## budgets
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK |
| user_id | INTEGER | FK users |
| category_id | INTEGER | FK categories, NULL означает общий лимит |
| period | TEXT | YYYY-MM |
| limit_amount | INTEGER | > 0 |
| currency | TEXT | валюта лимита |

Уникальность (user_id, category_id, period). Покрывает FR-010, FR-011, FR-012.

## fx_rates
| Поле | Тип | Ограничения |
|---|---|---|
| date | TEXT | часть составного ключа |
| base | TEXT | часть составного ключа |
| quote | TEXT | часть составного ключа |
| rate | REAL | курс, не денежная сумма |

Покрывает FR-001, BR-007.

## reports
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK |
| user_id | INTEGER | FK users |
| name | TEXT | NOT NULL |
| params_json | TEXT | период, фильтры, группировки |
| created_at | TEXT | NOT NULL |

Покрывает FR-021.

## recurring_templates
| Поле | Тип | Ограничения |
|---|---|---|
| id | INTEGER | PK |
| user_id | INTEGER | FK users |
| title | TEXT | NOT NULL |
| account_id | INTEGER | FK accounts |
| category_id | INTEGER | FK categories |
| type | TEXT | income, expense |
| amount | INTEGER | > 0 |
| currency | TEXT | RUB, USD, EUR |
| frequency | TEXT | daily, weekly, monthly, yearly |
| next_date | TEXT | дата следующего применения |
| comment | TEXT | необязательно |
| active | INTEGER | 0 или 1 |

Покрывает FR-022.

## Связи

users 1—N accounts, categories, transactions, budgets, reports, recurring_templates
users 1—1 user_settings
accounts 1—N transactions
categories 1—N transactions
categories 1—N budgets

## Правила целостности

- PRAGMA foreign_keys = ON обязателен на каждом соединении
- Удаление пользователя каскадно удаляет его данные
- Удаление категории или счёта при наличии операций запрещено на уровне сервиса
- Перевод требует account_id != target_account_id и совпадения валют либо
  явного указания суммы зачисления