
```golang
var message map[string]string = map[string][string]{
    "from_id": "",
    "to_id": "",
    "content": ""
}

chat := make(map[string]string){
    "name": "how to create maps in golang",
    "id": "chat_1123581321",
    "created_at": "2026-11-16 12:31"
}

message["from_id"] = "246"
message["to_id"] = "135"
message["content"] = "this is one way of making a map in golang"

created_at, ok := message["created_at"]

if(!ok){
    message["created_at"] = "2026-11-19 00:54"
}

delete(message, "created_at")
```

```golang
import "fmt"

func main() {
    studentGrades := map[string]int{
        "Danny": 90,
        "John": 85,
        "Belle": 70
    }

    studentGrades["Belle"] = 75
    delete(studentGrades, "John")

    grade_danny, ok_danny = studentGrades["Danny"]
    grade_john, ok_john = studentGrades["John"]
    grade_belle, ok_belle = studentGrades["Belle"]

    if(ok_danny){
        fmt.Printf("%s with a grade of %d", "Danny", grade_danny)
    } else {
        fmt.Printf("%s doesnt have a grade in map", "Danny")
    }

    if(ok_jonh){
        fmt.Printf("%s with a grade of %d", "John", grade_john)
    } else {
        fmt.Printf("%s doesnt have a grade in map", "John")
    }

    if(ok_belle){
        fmt.Printf("%s with a grade of %d", "Belle", grade_belle)
    } else {
        fmt.Printf("%s doesnt have a grade in map", "Belle")
    }
}

```