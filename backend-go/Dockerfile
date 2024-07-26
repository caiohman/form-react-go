FROM golang:1.22

WORKDIR /usr/src/app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod main.go ./
RUN go mod download && go mod verify

COPY . .

EXPOSE 8090

RUN go build -v -o /usr/local/bin/app ./...

CMD ["app"]