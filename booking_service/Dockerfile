FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY booking_service/requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY shared/ /shared/
COPY scripts/entrypoint-booking.sh /entrypoint.sh
COPY booking_service/ /app/

ENV PYTHONPATH=/shared
RUN chmod +x /entrypoint.sh

EXPOSE 8003

ENTRYPOINT ["/entrypoint.sh"]
