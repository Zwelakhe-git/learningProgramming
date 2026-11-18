

```golang
for i := 0; i < len(messages); i++ {
    fmt.println(messages[i])
}

func deleteUser(user_id){}

userIds := []string{"..."}

for i, user_id := range userIds {
    deleteUser(user_id)
}

for key, value := envVariables {
    fmt.Printf("%s=%s", key, value)
}

for _, name := range []string{"Danny", "John", "Belle"}{
    grade, exists = studentGrades[name]

    if(exists){
        fmt.Printf("%s with a grade of %d\n", name, grade)
    } else {
        fmt.Printf("%s doesnt have a grade in map\n", name)
    }
}
```