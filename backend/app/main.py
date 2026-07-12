from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine

app = FastAPI()

@app.get("/")
def home():
    return {"message": "TransitOps Backend RUNNINGGGG!"}

@app.get("/db-test")
def db_test():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT NOW();"))
        return {"database_time": str(result.scalar())}