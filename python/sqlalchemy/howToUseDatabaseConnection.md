
```python
from . import models
from .database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

def use_db(db: Session = Depends(get_db):
  user = db.query(models.User).filter(models.User.id == "123")
  if user:
    print("user found")
  else:
    print("user 123 not found")

def add_record():
  user = models.User(username="name", email="email")
  db.add(user)
  db.commit()
  db.refresh(user)
```
