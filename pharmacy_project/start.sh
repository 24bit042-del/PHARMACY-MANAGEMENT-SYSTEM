#!/usr/bin/env bash
set -e

python manage.py migrate --noinput

python - <<'PY'
from django.contrib.auth.models import User
from phrmacyapp.models import Profile

username = "Admin"
password = "Admin@123"

user, created = User.objects.get_or_create(username=username, defaults={"is_staff": True, "is_superuser": True})
if created:
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
else:
    # Ensure admin privileges and password are correct
    user.is_staff = True
    user.is_superuser = True
    user.set_password(password)
    user.save()

Profile.objects.get_or_create(user=user, defaults={"role": "admin"})
PY

exec gunicorn pharmacy_project.wsgi:application
