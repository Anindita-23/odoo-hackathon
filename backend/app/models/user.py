from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    password_hash: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id"),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    # Relationship
    role: Mapped["Role"] = relationship(
        "Role",
        back_populates="users"
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"