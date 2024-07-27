"""
Configuration for deployment to GCE with staging.Dockerfile
"""

import os

from hafizhelper.settings.base import *  # noqa: F403, F401

SECRET_KEY = os.environ.get("SECRET_KEY")

DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("STAGING_DB_NAME"),
        "USER": os.environ.get("STAGING_DB_USER"),
        "PASSWORD": os.environ.get("STAGING_DB_PASSWORD"),
        "HOST": os.environ.get("STAGING_DB_HOST"),
        "PORT": os.environ.get("SaTAGING_DB_PORT", "5432"),
        "CONN_MAX_AGE": int(os.environ.get("CONN_MAX_AGE", 0)),
    }
}
