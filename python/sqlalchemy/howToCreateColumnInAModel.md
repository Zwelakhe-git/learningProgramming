
```python
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

# inside the model
id: Mapped[int] = mapped_column(primay_key=True)
name: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
```