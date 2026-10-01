import celery app object from thefile we created it

```python
@celery_app.task(name="task_name", bind=True)
def my_task(arg1, arg2,...):
    #Do something.
    pass
```
