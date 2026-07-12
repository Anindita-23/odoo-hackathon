from __future__ import annotations

from typing import Any, Protocol

from fastapi import HTTPException, status


class MaintenanceRepositoryProtocol(Protocol):
    def get_vehicle(self, vehicle_id: int) -> dict[str, Any] | None:
        ...

    def create_maintenance_log(self, data: dict[str, Any]) -> dict[str, Any]:
        ...

    def update_vehicle(self, vehicle_id: int, **updates: Any) -> dict[str, Any]:
        ...


class MaintenanceService:
    def __init__(self, repository: MaintenanceRepositoryProtocol) -> None:
        self.repository = repository

    def create_maintenance_log(self, data: dict[str, Any]) -> dict[str, Any]:
        vehicle = self.repository.get_vehicle(data["vehicle_id"])
        if vehicle is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

        maintenance = self.repository.create_maintenance_log({**data, "status": "ACTIVE"})
        self.repository.update_vehicle(data["vehicle_id"], status="IN_SHOP")
        return maintenance

    def complete_maintenance(self, maintenance_id: int) -> dict[str, Any]:
        maintenance = self.repository.get_maintenance_log(maintenance_id)
        if maintenance is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Maintenance log not found")

        vehicle_id = maintenance["vehicle_id"]
        updated_maintenance = self.repository.update_maintenance_log(
            maintenance_id,
            status="COMPLETED",
            end_date=maintenance.get("end_date"),
        )
        self.repository.update_vehicle(vehicle_id, status="AVAILABLE")
        return updated_maintenance
