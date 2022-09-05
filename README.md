# QOwnNotes Web App

[Online](https://app.qownnotes.org/) |
[QOwnNotes](https://www.qownnotes.org "QOwnNotes Official Site") |
[Documentation](https://www.qownnotes.org/getting-started/web-app.html) |
[Docker image](https://hub.docker.com/repository/docker/pbeke/qownnotes-web-app) |
[Web Changelog](web/CHANGELOG.md)

[![Build](https://github.com/qownnotes/web-app/actions/workflows/build.yml/badge.svg)](https://github.com/qownnotes/web-app/actions/workflows/build.yml)

With the QOwnNotes Web App you are able to take photos from your smartphone and insert it into your current note in
[QOwnNotes](https://www.qownnotes.org "QOwnNotes Official Site").

## Screenshot

![Screenshot](screenshot.png)

## Build and run

```shell
make all && ./bin/server
```

You can now open a browser at <http://localhost:8080/>.

## Docker Compose

You can use this `docker-compose.yml` example to run a container with the docker image:

```yml
version: "3.1"

services:
  web-app:
    image: pbeke/qownnotes-web-app
    ports:
      - "8080:8080"
```
