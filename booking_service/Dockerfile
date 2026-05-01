FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY booking_service/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY booking_service/ /app/

CMD ["sh", "-c", "sleep 10 && python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8003"]