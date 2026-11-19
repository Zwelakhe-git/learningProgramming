package routers

import (
    "context"
    "fmt"
    "server/database"
    "server/models"
)

func GetAllUsers(ctx context.Context)([]models.User, error){
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

    err := database.Pool.QueryRow(ctx, "INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id", name, email).Scan(&user.ID)

    if err != nil {
        return models.User{}, fmt.Errorf("Insert user error: %w", err)
    }

    return user, nil
}