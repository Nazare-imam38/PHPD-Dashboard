from .base import *

# Local development overrides
DEBUG = True


# CORS – allow your React dev server
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:5001",
    "http://127.0.0.1:5001",
]

ALLOWED_HOSTS = ["*"]
DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', 
        'NAME': get_secret("DB_NAME", "phpd"),
        'USER': get_secret("DB_USER", "postgres"),
        'PASSWORD': get_secret("DB_PASSWORD", "admin123"),
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "django_cache_table",
    }
}

GDAL_LIBRARY_PATH = get_secret("GDAL_LIBRARY_PATH", "")
GEOS_LIBRARY_PATH = get_secret("GEOS_LIBRARY_PATH", "")
