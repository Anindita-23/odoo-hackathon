from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    Date,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base



class FuelLog(Base):

    __tablename__ = "fuel_logs"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id")
    )


    trip_id = Column(
        Integer,
        ForeignKey("trips.id")
    )


    liters = Column(
        Numeric
    )


    cost = Column(
        Numeric
    )


    log_date = Column(
        Date
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    vehicle = relationship(
        "Vehicle",
        back_populates="fuel_logs"
    )


    trip = relationship(
        "Trip",
        back_populates="fuel_logs"
    )