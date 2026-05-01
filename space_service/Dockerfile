FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    zlib1g-dev \
    libjpeg-dev \
    && rm -rf /var/lib/apt/lists/*

COPY space_service/requirements.txt /app/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY space_service/ /app/

CMD ["sh", "-c", "sleep 10 && python manage.py makemigrations && python manage.py migrate && python manage.py runserver 0.0.0.0:8002"]