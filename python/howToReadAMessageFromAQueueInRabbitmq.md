
```python
channel.queue_declare(queue='my_saved_queue', durable=True)

method_frame, header_frame, body = channel.basic_get(queue='my_saved_queue', auto_ack=False)

if method_frame:
    print(f"Received: {body.decode()}")
    # ... do your work here ...
    channel.basic_ack(delivery_tag=method_frame.delivery_tag)  # remove from queue
else:
    print("No message in queue.")

connection.close()
```
