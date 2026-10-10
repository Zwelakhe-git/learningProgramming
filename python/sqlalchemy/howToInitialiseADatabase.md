```python
from .database import Base, engine

def init_db():
  for _ in range(max_retries):
    try:
      Base.metadata.create_all(bind=engine)
      return
    except Exception as e:
      time.sleep(delay)
raise Exception("Failed to initialise database")
```
