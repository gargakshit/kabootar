FROM golang:1.20.1-alpine3.17 as builder
WORKDIR /app

ENV CGO_ENABLED 0

# Download the dependencies
COPY go.mod go.sum /app/
RUN go mod download -x

# Copy the source
COPY . /app/
RUN go build -o /app/kabootar ./cmd/signalling

# Final build
FROM scratch
WORKDIR /app

COPY --from=builder /app/kabootar /app/kabootar
ENTRYPOINT [ "/app/kabootar" ]
