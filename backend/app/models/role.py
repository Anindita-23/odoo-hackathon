from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Role(Base):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    role_name: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    # Relationships
    users: Mapped[list["User"]] = relationship(
        "User",
        back_populates="role",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Role(id={self.id}, role_name='{self.role_name}')>"