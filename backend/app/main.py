from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app.models import User, Role
from app.routes import router

app = FastAPI()
app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "TransitOps Backend RUNNINGGGG!"
    }



@app.get("/db-test")
def db_test():

    with engine.connect() as conn:
        result = conn.execute(
            "SELECT NOW();"
        )

        return {
            "database_time": str(result.scalar())
        }



@app.get("/users")
def get_users(
    db: Session = Depends(get_db)
):

    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role.role_name if user.role else None
        }
        for user in users
    ]


# ORM TEST
@app.get("/roles")
def get_roles(db: Session = Depends(get_db)):

    roles = db.query(Role).all()

    return [
        {
            "id": role.id,
            "role_name": role.role_name
        }
        for role in roles
    ]