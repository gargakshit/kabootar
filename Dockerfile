# Stage 1: Build the web application
FROM node:20-alpine AS web_builder
WORKDIR /app

# Copy the package files and install the deps
COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

# Copy rest of the stuff
COPY . .

# Build!
RUN yarn build

# Stage 2: Build the standalone app
FROM golang:1.21.6-alpine AS builder
WORKDIR /app/standalone

# Copy the package files and install the deps
COPY standalone/go.mod standalone/go.sum /app/standalone/
RUN go mod download -x

# Copy rest of standalone and the built web files
COPY standalone .
COPY --from=web_builder /app/standalone/web/static /app/standalone/web/static

# Build!
RUN go build -o out/kabootar -tags=prod -trimpath -ldflags="-s -w" ./cmd/kabootar

# Stage 3: Final image
FROM gcr.io/distroless/static-debian12:latest
WORKDIR /app

COPY --from=builder /app/standalone/out/kabootar /app/kabootar
ENTRYPOINT [ "/app/kabootar" ]
