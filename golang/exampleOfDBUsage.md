
## pwd = myapp

```shell
go get github.com/jackc/pgx/v5
```


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

```golang
// models/user.go
package models

type User struct {
    ID int
    Name string
    Email string
}

```

```golang
// routers/users.go
package routers

import (
    "context",
    "fmt",
    "myapp/database",
    "myapp/models"
)

func GetAllUsers(ctx context.Context)([]models.Users, error){
    var users []models.User
    rows, err := database.Pool.Query(ctx, "SELECT name, email FROM users")

    if err != nil {
        return nil, fmt.Errorf("query users %w", err)
    }
    defer rows.Close()

    for rows.Next() {
        var u models.User
        if err := rows.Scan(&u.ID, &u.Name, &u.Email); err != nil {
            return nil, fmt.Errorf("Scan of user: %w", err)
        }
        users = append(users, u)
    }
    return users, rows.Err()
}

func CreateUser(ctx context.Context, name string, email string) (models.User, error) {
    user := models.User{Name: name, Email: email}

    err := database.Pool.QueryRow(ctx, "INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id", name, email).Scan($user.ID)

    if err != nil {
        return models.User{}, fmt.Errorf("Insert user error: %w", err)
    }

    return user, nil
}
```

```golang
// main.go
package main

import (
    "context",
    "fmt",
    "log",
    "myapp/database",
    "myapp/routers"
)

func main(){
    ctx := context.Background()

    if err := database.Connect(); err != nil {
        log.Fatal(err)
    }
    defer database.Pool.Close()

    u, err := routers.CreateUser(ctx, "Digma", "digma@gmail.com")

    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("User created:", u)

    users, err := routers.GetAllUsers(ctx)

    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(users)
}

```