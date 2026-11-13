before begining the file send sequence:
```json
{
    "User-Agent": "MySpider/1.0",//or any other user agent,
    "Accept" "application/json",
    "Accept-Language" "ru, ru-RU",
    "Content-Type": "multipart/form-data; boundary=--boundaryName",
}
```

start the sequence
```java
/*
variables to define:
formFieldName
filename
boundaryName
bytes
*/
try(PrintStream out = new PrintStream(mew BufferedOutputStream(conn.getOutputStream()), false, StandarCharsets.UTF_8)){
    out.print(String.format("Content-Disposition: form-data; name=\"%s\"; filename=\"%s\"\n", formFieldName, filename));
    out.print(String.format("Content-Type: %s\n\n", contentType));
    out.write(bytes);
    out.print("\n--boundaryName--");
} catch(Exception e){}

conn.connet();
int responseCode = conn.getResponseCode();
String responseText = "";

try(Reader reader = new InputStreamReader(conn.getInputStream(), "utf-8");
    BufferedReader bfr = new BufferedReader(reader);
){
    String line = "";
    while((line = bfr.readLine()) != null){
        responseText += line + "\n";
    }
}

if(conn != null) conn.disconnect();
```