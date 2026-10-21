```python
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

user_id; Mapped[int | None] = mapped_column(ForeignKey=("other_tablename.id"), nullable=True)
```