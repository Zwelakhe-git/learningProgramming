```golang
// database/database.go
package database

import (
	"context",
	"fmt",
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect(ctx context.Context) error {
    dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        dsn = "postgres://postgres:secret@localhost:5432/mydb?sslmode=disable"
    }

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
        return fmt.Errorf("Unablet to create pool: %v", err)
	}

	if err := pool.Ping(ctx); err != nil {
        Pool.Close()
        return fmt.Errorf("cannot reach database: %v", err)
	}
	Pool = pool
    return nil
}

```