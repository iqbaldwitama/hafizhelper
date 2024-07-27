"""
Configuration for deployment to GCE with dev.Dockerfile
"""

import os

from hafizhelper.settings.base import *  # noqa: F403, F401

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY", "development")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DEV_DB_NAME"),
        "USER": os.environ.get("DEV_DB_USER"),
        "PASSWORD": os.environ.get("DEV_DB_PASSWORD"),
        "HOST": os.environ.get("DEV_DB_HOST"),
        "PORT": os.environ.get("DEV_DB_PORT", "5432"),
        "CONN_MAX_AGE": int(os.environ.get("CONN_MAX_AGE", 0)),
    }
}
