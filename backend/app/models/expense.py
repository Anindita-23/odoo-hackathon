from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    Date,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base



class Expense(Base):

    __tablename__ = "expenses"


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


    expense_type = Column(
        String
    )


    amount = Column(
        Numeric
    )


    description = Column(
        Text
    )


    expense_date = Column(
        Date
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    vehicle = relationship(
        "Vehicle",
        back_populates="expenses"
    )


    trip = relationship(
        "Trip",
        back_populates="expenses"
    )