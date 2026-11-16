before begining the file send sequence:
```json
{
    "User-Agent": "MySpider/1.0",//or any other user agent,
    "Accept" "application/json",
    "Accept-Language" "ru, ru-RU",
    "Content-Type": "multipart/form-data; boundary=boundaryName",
}
```

start the sequence
```java
/*
variables to define:
formFieldName
filename
boundary
bytes
SysIo - custom class
*/
try (InputStream in = Files.newInputStream(p);){
    String contentType = Files.probeContentType(p);
    if (contentType == null) contentType = "application/octet-stream";

    URL url = (new URI(this.url)).toURL();
    conn = (HttpURLConnection)url.openConnection();
    conn.setRequestMethod(this.method);
    conn.setDoOutput(true);
    conn.setDoInput(true);
    conn.setRequestProperty("Content-Type", String.format("multipart/form-data; boundary=%s", boundary));

    PrintStream out = new PrintStream(new BufferedOutputStream(conn.getOutputStream()), false, StandardCharsets.UTF_8);
    
    int n = 0;
    out.print(String.format("--%s\r\n", boundary));
    out.print(String.format("Content-Disposition: form-data; name=\"%s\"; filename=\"%s\"\r\n", formFieldName, filename));
    out.print(String.format("Content-Type: %s\r\n\r\n", contentType));
    
    while((n = in.read(buffer)) != -1){
        out.write(buffer, 0, n);
    }
    out.print(String.format("\r\n--%s--\r\n", boundary));
    out.flush();
    out.close();
    int responseCode = conn.getResponseCode();
    if(responseCode >= 200 && responseCode < 300){
        try (BufferedReader bfr = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))){
            String line = "";
            
            while((line = bfr.readLine()) != null){
                SysIo.println(line);
            }
        }
    } else {
        SysIo.println(String.format("Failed to upload file. response code: %s", responseCode));
    }
    

} catch(Exception e){
    e.printStackTrace();
} finally {
    SysIo.print("disconnecting connection");
    if(conn != null) { conn.disconnect(); }
}
```