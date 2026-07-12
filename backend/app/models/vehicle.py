from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Enum, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, VehicleStatus


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    registration_number: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False
    )

    vehicle_name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    vehicle_type: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    max_load_capacity: Mapped[Decimal] = mapped_column(
        Numeric
    )

    odometer: Mapped[Decimal] = mapped_column(
        Numeric
    )

    acquisition_cost: Mapped[Decimal] = mapped_column(
        Numeric
    )

    status: Mapped[VehicleStatus] = mapped_column(
        Enum(
            VehicleStatus,
            name="vehicle_status"
        ),
        nullable=False
    )

    region: Mapped[str] = mapped_column(
        String
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
        back_populates="vehicle"
    )

    maintenance_logs: Mapped[list["MaintenanceLog"]] = relationship(
        "MaintenanceLog",
        back_populates="vehicle"
    )

    fuel_logs: Mapped[list["FuelLog"]] = relationship(
        "FuelLog",
        back_populates="vehicle"
    )

    expenses: Mapped[list["Expense"]] = relationship(
        "Expense",
        back_populates="vehicle"
    )


    def __repr__(self):
        return (
            f"<Vehicle(id={self.id}, "
            f"registration='{self.registration_number}')>"
        )