
```python
channel.queue_declare(queue='my_saved_queue', durable=True)

# 3. Publish the message
channel.basic_publish(
    exchange='',                    # default exchange routes directly by routing_key
    routing_key='my_saved_queue',   # must match the queue name
    body='Hello RabbitMQ!',         # can be a str or bytes
    properties=pika.BasicProperties(
        delivery_mode=pika.DeliveryMode.Persistent,  # survive broker restart
    ),
)
connection.close();
```
