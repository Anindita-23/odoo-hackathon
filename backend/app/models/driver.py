from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, Enum, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, DriverStatus


class Driver(Base):
    __tablename__ = "drivers"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    license_number: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    license_category: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    license_expiry: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    contact_number: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    safety_score: Mapped[Decimal] = mapped_column(
        Numeric
    )

    status: Mapped[DriverStatus] = mapped_column(
        Enum(
            DriverStatus,
            name="driver_status"
        ),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )


    # Relationships

    trips: Mapped[list["Trip"]] = relationship(
        "Trip",
        back_populates="driver"
    )


    def __repr__(self):
        return (
            f"<Driver(id={self.id}, "
            f"name='{self.name}')>"
        )