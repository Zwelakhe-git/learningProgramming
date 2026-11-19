package main
import (
	"context"
	"fmt"
	"encoding/json"
	"log"
	"net/http"
	"server/database"
	"server/routers"
)

func main(){
	context := context.Background()

	if err := database.Connect(context); err != nil {
		log.Fatal(err)
	}

	defer database.Pool.Close()
}

func getUsers(w http.ResponseWriter, r *http.Request){
	users, err := routers.GetAllUsers(r.Context())

	if err != nil {
		http.Error(w, "failed to get users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func createUser(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Name string `json:"name"`
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	user, err := routers.CreateUser(r.Context(), input.Name, input.Email)

	if err != nil {
		http.error(w, "failed to create user", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}