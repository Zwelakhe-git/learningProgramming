## example from waste track app

```python
query = select(WasteRecord).options(
    selectinload(WasteRecord.product).selectinload(Product.unit),
    selectinload(WasteRecord.reason)
)

result = await db.execute(query.order_by(WasteRecord.created_at.desc()))
return result.scalars().all()
```