FROM golang:alpine AS builder

WORKDIR /app
COPY . .

RUN go build -ldflags="-w -s" -o fullcycle

FROM scratch

COPY --from=builder /app/fullcycle .

ENTRYPOINT ["./fullcycle"]
