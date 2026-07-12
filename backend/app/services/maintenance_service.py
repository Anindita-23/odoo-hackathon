from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.base import MaintenanceStatus, VehicleStatus
from app.models.maintenance_log import MaintenanceLog
from app.models.vehicle import Vehicle


class MaintenanceService:
    def __init__(self, db: Session):
        self.db = db

    def create_maintenance_log(self, data):
        vehicle = (
            self.db.query(Vehicle)
            .filter(Vehicle.id == data.vehicle_id)
            .first()
        )

        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )

        maintenance = MaintenanceLog(
            vehicle_id=data.vehicle_id,
            description=data.description,
            cost=data.cost,
            status=MaintenanceStatus.ACTIVE,
            start_date=data.start_date,
            end_date=data.end_date,
            created_at=datetime.utcnow(),
        )

        self.db.add(maintenance)
        vehicle.status = VehicleStatus.IN_SHOP

        self.db.commit()
        self.db.refresh(maintenance)

        return maintenance

    def complete_maintenance(self, maintenance_id: int):
        maintenance = (
            self.db.query(MaintenanceLog)
            .filter(MaintenanceLog.id == maintenance_id)
            .first()
        )

        if maintenance is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Maintenance log not found",
            )

        maintenance.status = MaintenanceStatus.COMPLETED
        maintenance.end_date = datetime.now().date()

        if maintenance.vehicle:
            maintenance.vehicle.status = VehicleStatus.AVAILABLE

        self.db.commit()
        self.db.refresh(maintenance)

        return maintenance
