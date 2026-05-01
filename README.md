# DeskSpace

DeskSpace — це сучасний сервіс для бронювання переговорних кімнат та робочих місць. Проект побудований на мікросервісній архітектурі з використанням Django (Backend) та React/Vite (Frontend).

## 🏗 Архітектура проекту

Проект складається з наступних сервісів, які оркеструються через Docker Compose:

- **API Gateway (Nginx)**: Єдина точка входу. Маршрутизує запити до фронтенду або відповідних бекенд-мікросервісів.
- **Frontend (React + Vite)**: Клієнтський додаток (порт `5173`).
- **Auth Service (Django)**: Сервіс автентифікації та управління користувачами (порт `8001`).
- **Space Service (Django)**: Сервіс управління поверхами, кімнатами та робочими місцями (порт `8002`).
- **Booking Service (Django)**: Сервіс управління бронюваннями (порт `8003`).

Кожен бекенд-сервіс має власну базу даних PostgreSQL.

## 🚀 Як запустити проект локально

Для запуску проекту вам знадобляться встановлені **Docker** та **Docker Compose**.

### 1. Клонування репозиторію

```bash
git clone <url-вашого-репозиторію>
cd DeskSpace
```

### 2. Запуск контейнерів

Запустіть усі сервіси у фоновому режимі за допомогою Docker Compose:

```bash
docker-compose up -d --build
```

Ця команда завантажить необхідні образи, збере контейнери та запустить їх. Перший запуск може зайняти кілька хвилин.

### 3. Застосування міграцій бази даних

Після того, як контейнери успішно запустилися, необхідно створити таблиці в базах даних для кожного мікросервісу:

```bash
# Міграції для сервісу автентифікації
docker-compose exec auth_service python manage.py migrate

# Міграції для сервісу просторів (кімнат та столів)
docker-compose exec space_service python manage.py migrate

# Міграції для сервісу бронювання
docker-compose exec booking_service python manage.py migrate
```

### 4. Наповнення бази даних (Seeding)

Щоб інтерфейс не був порожнім, необхідно додати початкові дані (поверхи, кімнати, столи). Для цього виконайте скрипт сідінгу в `space_service`:

```bash
docker-compose exec space_service python seed.py
```

### 5. Використання додатку

Після виконання всіх кроків додаток буде доступний у вашому браузері:

- **Головна сторінка (Frontend)**: [http://localhost](http://localhost) (або `http://localhost:5173` напряму)
- **API**: Усі запити до API проходять через `http://localhost/api/...`

### Зупинка проекту

Щоб зупинити всі запущені контейнери, виконайте:

```bash
docker-compose down
```

Якщо ви хочете зупинити контейнери та **видалити всі дані** з баз даних (очистити volumes), додайте прапорець `-v`:

```bash
docker-compose down -v
```

## 🛠 Технологічний стек

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, TanStack Router, TanStack Query.
- **Backend**: Python, Django, Django REST Framework, PostgreSQL.
- **Інфраструктура**: Docker, Docker Compose, Nginx.
