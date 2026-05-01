# DeskSpace

DeskSpace — це сучасний сервіс для бронювання переговорних кімнат та робочих місць. Проект побудований на мікросервісній архітектурі з використанням Django (Backend) та React/Vite (Frontend).

## 🏗 Архітектура та структура проекту

Проект складається з наступних сервісів, які оркеструються через Docker Compose:

- **API Gateway (Nginx)**: Єдина точка входу. Маршрутизує запити до фронтенду або відповідних бекенд-мікросервісів.
- **Frontend (React + Vite)**: Клієнтський додаток (порт `5173`).
- **Auth Service (Django)**: Сервіс автентифікації та управління користувачами (порт `8001`).
- **Space Service (Django)**: Сервіс управління поверхами, кімнатами та робочими місцями (порт `8002`).
- **Booking Service (Django)**: Сервіс управління бронюваннями (порт `8003`).

Кожен бекенд-сервіс має власну базу даних PostgreSQL.

### Структура директорій

```text
DeskSpace/
├── api_gateway/            # Nginx конфігурація та Dockerfile
├── auth_service/           # Мікросервіс автентифікації (Django)
│   ├── config/             # Налаштування Django
│   ├── users/              # Додаток користувачів
│   │   ├── tests/          # Юніт та інтеграційні тести
│   │   └── ...
│   ├── requirements.txt    # Залежності сервісу
│   └── Dockerfile
├── booking_service/        # Мікросервіс бронювань (Django)
│   ├── config/
│   ├── bookings/
│   │   ├── tests/          # Юніт та інтеграційні тести
│   │   └── ...
│   ├── requirements.txt
│   └── Dockerfile
├── space_service/          # Мікросервіс просторів (Django)
│   ├── config/
│   ├── spaces/
│   │   ├── tests/          # Юніт та інтеграційні тести
│   │   └── ...
│   ├── requirements.txt
│   ├── seed.py             # Скрипт для наповнення БД
│   └── Dockerfile
├── e2e_tests/              # End-to-End тести (Pytest)
│   └── test_e2e.py
├── frontend/               # Клієнтський додаток (React)
├── docker-compose.yml      # Оркестрація всіх сервісів
└── README.md
```

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
- **Тестування**: Django Test Framework (Unit & Integration), Pytest + Requests (E2E).
- **Інфраструктура**: Docker, Docker Compose, Nginx.

---

## 🧪 Тестування

Проект покритий юніт-тестами, інтеграційними тестами (всередині кожного сервісу) та End-to-End (E2E) тестами, що перевіряють роботу всього ланцюжка через API Gateway.

### Підготовка середовища (Virtual Environment)

Для запуску тестів локально вам потрібно створити віртуальне середовище Python і встановити залежності. 

**Для Linux / macOS:**
```bash
# Створення віртуального середовища
python3 -m venv venv

# Активація
source venv/bin/activate

# Встановлення залежностей для всіх сервісів та E2E тестів
pip install -r auth_service/requirements.txt
pip install -r space_service/requirements.txt
pip install -r booking_service/requirements.txt
pip install pytest requests
```

**Для Windows (PowerShell / CMD):**
```powershell
# Створення віртуального середовища
python -m venv venv

# Активація
.\venv\Scripts\activate

# Встановлення залежностей для всіх сервісів та E2E тестів
pip install -r auth_service\requirements.txt
pip install -r space_service\requirements.txt
pip install -r booking_service\requirements.txt
pip install pytest requests
```

### Запуск тестів (Єдина точка входу)

Для зручності в корені проекту є скрипт `run_tests.py`, який дозволяє запускати всі тести або лише вибрані за допомогою прапорців.

Переконайтеся, що ваше віртуальне середовище активоване, і виконайте:

```bash
# Запустити всі тести (Юніт, Інтеграційні та E2E)
python run_tests.py --all
# або просто: python run_tests.py

# Запустити лише юніт та інтеграційні тести (без E2E)
python run_tests.py --unit

# Запустити лише E2E тести (потребує запущених Docker-контейнерів)
python run_tests.py --e2e

# Запустити тести для конкретного сервісу
python run_tests.py --auth
python run_tests.py --space
python run_tests.py --booking
```

> **Примітка:** Юніт та інтеграційні тести не потребують запущених Docker-контейнерів, оскільки Django автоматично створює тимчасову тестову базу даних. E2E тести роблять реальні HTTP-запити до вашого API, тому **перед їх запуском всі сервіси мають бути підняті через Docker Compose** (`docker-compose up -d`).
