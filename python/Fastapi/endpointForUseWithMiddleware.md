```python
import shutil
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_TYPES = {"image/png", "image/jpeg", "application/pdf"}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, f"Unsupported type: {file.content_type}")

    # Never trust the client's filename as a path
    safe_name = Path(file.filename).name
    dest = UPLOAD_DIR / safe_name

    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)  # streams; doesn't load whole file in RAM

    return {"filename": safe_name, "content_type": file.content_type}
```
