from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Numeric,
    Date,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum

from app.models.base import Base



class MaintenanceStatus(str, PyEnum):

    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"



class MaintenanceLog(Base):

    __tablename__ = "maintenance_logs"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id")
    )


    description = Column(
        Text
    )


    cost = Column(
        Numeric
    )


    status = Column(
        Enum(MaintenanceStatus),
        default=MaintenanceStatus.ACTIVE
    )


    start_date = Column(
        Date
    )


    end_date = Column(
        Date
    )


    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


    vehicle = relationship(
        "Vehicle",
        back_populates="maintenance_logs"
    )