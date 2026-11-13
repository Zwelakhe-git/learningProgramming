### reading an entire file at once
```java
Path p = Path.get("path/to/file");
byte[] bytes = Files.readAllBytes(p);
```