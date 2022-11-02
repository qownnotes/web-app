# Build go app
FROM golang:alpine as go
COPY *.go /build/
COPY *.mod /build/
COPY *.sum /build/
WORKDIR /build
RUN go build -o server

# Build vue.js app
FROM node:18-alpine as node
COPY ./web /build
WORKDIR /build
RUN npm install
RUN export NODE_OPTIONS=--openssl-legacy-provider; npm run build

# Create container to serve the app
FROM alpine
COPY --chown=nobody --from=go /build/server /app/server
COPY --chown=nobody --from=node /build/dist /app/web/dist
USER nobody
WORKDIR /app
ENTRYPOINT [ "./server" ]
