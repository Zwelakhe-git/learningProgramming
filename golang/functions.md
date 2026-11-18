
```golang
var users []map[string][string]

func deleteUser(userId string) bool {
    for i, user := range users {
        if(user["id"] == userId){
            break
        }
    }
}

func fetch(url string, options map[string][string]) (int, string){
    statusCode := 200
    var message string = "Server online"
    return statusCode, message
}

func sumAll(numbers []int) int {
    var sum int = 0
    for _, num := range numbers{
        sum := sum + num
    }
    return sum
}
```