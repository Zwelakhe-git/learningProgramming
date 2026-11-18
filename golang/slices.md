

```golang
var connectedClients []string

connectedClients = append(connectedClients, "win10")
connectedClients = append(connectedClients, "digma")
connectedClients = append(connectedClients, "win11")

messageContents := []string{ "hello", "continue learning golang" }

fmt.Printf("you have %d messages. capacity of the messageCotents slide is %d", len(messageContents), cap(messageContents))

messages := make([]string, 0, 100)
```