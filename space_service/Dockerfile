FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    # Додаємо залежності для Pillow (робота з картинками)
    zlib1g-dev \
    libjpeg-dev \
    && rm -rf /var/lib/apt/lists/*

COPY space_service/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY space_service/ /app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8002"]
