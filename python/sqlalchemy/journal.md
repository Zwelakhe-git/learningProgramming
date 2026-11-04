look at how we create a basic session instance:
```python
with Session(engine) as session:
    ...
```

is this similar to how we created it in our get_db generator? i didnt pay attention until now.

ACTUALY, NO. WE USED SOMETHING ELSE: `sessionmaker` FROM `sqlalchemy.orm`. HERE'S HOW ITS DONE.
```python
sessionLocal = sessionmaker(autocommit=False, autoFlush=False, bind=engine)
```

THEN GETTING THE ACTUAL SESSION: `db_session = sessionLocal()`. CALL IT WHATEVER YOU LIKE: db, db_session, session. THE POINT IS ITS THE DB SESSION WE USE FOR OPERATIONS.

ok but what about creating the base class?

THERES ALSO TWO WAYS. ONE IS SIMPLE. JUST USE `declarative_base` FROM `sqlalchemy.ext.declarative`. LIKE THIS: `Base = declarative_base()`.
THE OTHER METHOD IS TO CREATE A CLASS YOURSELF THEN MAKE IT INHERIT FROM THE BASE CLASS.