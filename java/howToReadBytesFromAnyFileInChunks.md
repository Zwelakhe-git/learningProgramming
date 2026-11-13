

```java
Path p = Path.of("path/to/file");
byte[] buffer = new byte[8192];

try (InputStream in = new BufferedInputStream(Files.newInputStream(p))){
    int n;
    while((n = in.read(buff)) != -1){
        process(buff, 0, n);
    }
}