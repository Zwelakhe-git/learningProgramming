

```python
from fastapi import FastAPI, HTTPException, UploadFile, File
from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Receive, Scope, Send


class UploadLimitMiddleware:
    def __init__(self, app: ASGIApp, max_bytes: int, path_prefix: str = "/upload"):
        self.app = app
        self.max_bytes = max_bytes
        self.path_prefix = path_prefix

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        # Only touch HTTP uploads on the chosen paths
        if (
            scope["type"] != "http"
            or scope["method"] not in ("POST", "PUT", "PATCH")
            or not scope["path"].startswith(self.path_prefix)
        ):
            await self.app(scope, receive, send)
            return

        headers = dict(scope["headers"])

        # Reject wrong content types early
        content_type = headers.get(b"content-type", b"").decode()
        if not content_type.startswith("multipart/form-data"):
            response = JSONResponse({"detail": "Expected multipart/form-data"}, status_code=415)
            await response(scope, receive, send)
            return

        # Fast path: trust Content-Length if present
        content_length = headers.get(b"content-length")
        if content_length and int(content_length) > self.max_bytes:
            response = JSONResponse({"detail": "File too large"}, status_code=413)
            await response(scope, receive, send)
            return

        # Slow path: count bytes as they arrive (covers chunked uploads / lying clients)
        received = 0

        async def limited_receive():
            nonlocal received
            message = await receive()
            if message["type"] == "http.request":
                received += len(message.get("body", b""))
                if received > self.max_bytes:
                    raise HTTPException(status_code=413, detail="File too large")
            return message

        await self.app(scope, limited_receive, send)


app = FastAPI()
app.add_middleware(UploadLimitMiddleware, max_bytes=10 * 1024 * 1024)  # 10 MB
```
