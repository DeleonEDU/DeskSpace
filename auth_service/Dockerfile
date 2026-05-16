FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY auth_service/requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY shared/ /shared/
COPY scripts/entrypoint-auth.sh /entrypoint.sh
COPY auth_service/ /app/

ENV PYTHONPATH=/shared
RUN chmod +x /entrypoint.sh

EXPOSE 8001

ENTRYPOINT ["/entrypoint.sh"]
