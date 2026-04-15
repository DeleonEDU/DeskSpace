FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip
RUN pip install django psycopg2-binary djangorestframework

COPY . /app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]