"""
Configuration for deployment to GCE with prod.Dockerfile
"""

import os

from hafizhelper.settings.base import *  # noqa: F403, F401

# set SECRET_KEY for production
SECRET_KEY = os.environ.get("SECRET_KEY")

# debug has to be false in production
DEBUG = False

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("PROD_DB_NAME"),
        "USER": os.environ.get("PROD_DB_USER"),
        "PASSWORD": os.environ.get("PROD_DB_PASSWORD"),
        "HOST": os.environ.get("PROD_DB_HOST"),
        "PORT": os.environ.get("PROD_DB_PORT", "5432"),
        "CONN_MAX_AGE": int(os.environ.get("CONN_MAX_AGE", 0)),
    }
}
