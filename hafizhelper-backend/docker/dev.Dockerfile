# pull the official docker image
FROM python:3.12-alpine

# set work directory
WORKDIR /app/backend

# set env variables
ARG JDBC_DATABASE_DEV_USERNAME
ARG JDBC_DATABASE_DEV_PASSWORD
ARG JDBC_DATABASE_DEV_HOST
ARG SECRET_KEY

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DEV_DB_NAME postgres
ENV DEV_DB_USER ${JDBC_DATABASE_DEV_USERNAME}
ENV DEV_DB_PASSWORD ${JDBC_DATABASE_DEV_PASSWORD}
ENV DEV_DB_HOST ${JDBC_DATABASE_DEV_HOST}
ENV SECRET_KEY ${SECRET_KEY}
ENV ENVIRONMENT dev
ENV DJANGO_SETTINGS_MODULE hafizhelper.settings.dev

# install dependencies
COPY requirements.txt .

# Install required libraries and Python dependencies
RUN  \
    apk update && \
    apk upgrade && \
    apk add --no-cache bash postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    pip3 install --upgrade pip -r requirements.txt && \
    apk --purge del .build-deps

# Add the rest of the code
COPY . .

# Copy scripts to main directory
COPY ./scripts/ /app/

# Make port 8000 available for the app
ENV PORT 8000
EXPOSE 8000

# Be sure to use 0.0.0.0 for the host within the Docker container,
# otherwise the browser won't be able to find it
RUN ["chmod", "+x", "/app/entrypoint.sh"]
ENTRYPOINT [ "/app/entrypoint.sh" ]
