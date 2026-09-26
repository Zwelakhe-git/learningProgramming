hset is enough

```php
$client->set($key, $assocArr);
```

recommended if the array is flat, otherwise its best to save as json, especially if its gonna be a readonly value
