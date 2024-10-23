FROM postgres:latest

ARG POSTGRES_USER
ARG POSTGRES_PASSWORD
ARG POSTGRES_DB
ARG POSTGRES_HOST

RUN echo $POSTGRES_USER

COPY ./init.sh /docker-entrypoint-initdb.d/init.sh