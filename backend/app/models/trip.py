from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    String
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TripStatus


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    vehicle_id: Mapped[int] = mapped_column(
        ForeignKey("vehicles.id"),
        nullable=False
    )

    driver_id: Mapped[int] = mapped_column(
        ForeignKey("drivers.id"),
        nullable=False
    )

    source: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    destination: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    cargo_weight: Mapped[Decimal] = mapped_column(
        Numeric
    )

    planned_distance: Mapped[Decimal] = mapped_column(
        Numeric
    )

    actual_distance: Mapped[Decimal] = mapped_column(
        Numeric
    )

    revenue: Mapped[Decimal] = mapped_column(
        Numeric
    )

    fuel_used: Mapped[Decimal] = mapped_column(
        Numeric
    )

    final_odometer: Mapped[Decimal] = mapped_column(
        Numeric
    )

    status: Mapped[TripStatus] = mapped_column(
        Enum(
            TripStatus,
            name="trip_status"
        ),
        nullable=False
    )

    dispatch_time: Mapped[datetime] = mapped_column(
        DateTime
    )

    completion_time: Mapped[datetime] = mapped_column(
        DateTime
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )


    # Relationships

    vehicle: Mapped["Vehicle"] = relationship(
        "Vehicle",
        back_populates="trips"
    )

    driver: Mapped["Driver"] = relationship(
        "Driver",
        back_populates="trips"
    )

    fuel_logs: Mapped[list["FuelLog"]] = relationship(
        "FuelLog",
        back_populates="trip"
    )

    expenses: Mapped[list["Expense"]] = relationship(
        "Expense",
        back_populates="trip"
    )


    def __repr__(self):
        return (
            f"<Trip(id={self.id}, "
            f"source='{self.source}', "
            f"destination='{self.destination}')>"
        )