
`PrintStream ps = new PrintStream(new BufferedOutputStream(socket.getOutputStream()), false, StandardCharsests.UTF_8)`
## print
converts the data to text using the indicated encoding. `print(65)` becomes '65'.

## write
sends raw bytes as-is. useful for file content, especially binary