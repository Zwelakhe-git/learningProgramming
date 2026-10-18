```bash
pip install pika
```

```python
import pika

# 1. Connect (use ConnectionParameters if your RabbitMQ is not on localhost/guest)
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# 2. Declare the queue (this "saves" it)
# durable=True ensures the queue survives a RabbitMQ restart
channel.queue_declare(queue='my_saved_queue', durable=True)

# 3. Close connection
connection.close()
```
