## create an engine
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv
import time

load_dotenv()

DB_URL = os.get_env("DB_URL")
def create_db_engine(db_url, max_retries=3, delay=3):
  retry_count = 0
  for _ in range(max_retries):
    try:
      engine = create_engine(db_url, pool_pre_ping=True)
      with engine.connection() as conn:
        return engine
    except OperationalError as e:
      time.sleep(delay)
  raise Exception("Failed to connect to database")

engine = create_db_engine(DB_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
base = declarative_base()

def get_db():
  db = SessionLocal()
  try:
    yield db
  finally:
    db.close()
```
