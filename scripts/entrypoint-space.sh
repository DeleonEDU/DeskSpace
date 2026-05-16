#!/bin/sh
set -e
python manage.py migrate --noinput
python manage.py seed_spaces || true
exec python manage.py runserver 0.0.0.0:8002
