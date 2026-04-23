FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY auth_service/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY auth_service/ /app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]