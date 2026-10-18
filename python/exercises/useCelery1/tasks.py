from .celery_app import celery_app
import json

@celery_app.task(name="send_message", bind=True)
def send_message(rec_id: int, content: str):
    print(json.dumps({
        rec_id: rec_id,
        content: content
    }))