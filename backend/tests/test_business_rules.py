from __future__ import annotations

from typing import Any

import pytest
from fastapi import HTTPException

from app.services.fuel_expense_service import FuelExpenseService
from app.services.maintenance_service import MaintenanceService


class DummyMaintenanceRepository:
    def __init__(self) -> None:
        self.vehicles = {1: {"id": 1, "status": "AVAILABLE"}}
        self.maintenance_logs = []

    def get_vehicle(self, vehicle_id: int) -> dict[str, Any] | None:
        return self.vehicles.get(vehicle_id)

    def create_maintenance_log(self, data: dict[str, Any]) -> dict[str, Any]:
        maintenance = {"id": 1, **data}
        self.maintenance_logs.append(maintenance)
        return maintenance

    def get_maintenance_log(self, maintenance_id: int) -> dict[str, Any] | None:
        return next((log for log in self.maintenance_logs if log["id"] == maintenance_id), None)

    def update_maintenance_log(self, maintenance_id: int, **updates: Any) -> dict[str, Any]:
        maintenance = self.get_maintenance_log(maintenance_id)
        maintenance.update(updates)
        return maintenance

    def update_vehicle(self, vehicle_id: int, **updates: Any) -> dict[str, Any]:
        vehicle = self.vehicles[vehicle_id]
        vehicle.update(updates)
        return vehicle


class DummyFuelExpenseRepository:
    def __init__(self) -> None:
        self.vehicles = {1: {"id": 1}}
        self.trips = [{"id": 1, "vehicle_id": 1, "status": "DISPATCHED"}]
        self.fuel_logs = []
        self.expenses = []

    def get_trip(self, trip_id: int) -> dict[str, Any] | None:
        return next((trip for trip in self.trips if trip["id"] == trip_id), None)

    def get_vehicle(self, vehicle_id: int) -> dict[str, Any] | None:
        return self.vehicles.get(vehicle_id)

    def create_fuel_log(self, data: dict[str, Any]) -> dict[str, Any]:
        fuel_log = {"id": 1, **data}
        self.fuel_logs.append(fuel_log)
        return fuel_log

    def create_expense(self, data: dict[str, Any]) -> dict[str, Any]:
        expense = {"id": 1, **data}
        self.expenses.append(expense)
        return expense


def test_create_maintenance_marks_vehicle_in_shop() -> None:
    repo = DummyMaintenanceRepository()
    service = MaintenanceService(repo)

    maintenance = service.create_maintenance_log({"vehicle_id": 1, "description": "Inspection", "cost": 100})

    assert maintenance["status"] == "ACTIVE"
    assert repo.vehicles[1]["status"] == "IN_SHOP"


def test_create_fuel_log_rejects_mismatched_vehicle() -> None:
    repo = DummyFuelExpenseRepository()
    service = FuelExpenseService(repo)

    with pytest.raises(HTTPException):
        service.create_fuel_log({"vehicle_id": 2, "trip_id": 1, "liters": 20, "cost": 50})


def test_create_expense_requires_vehicle_or_trip() -> None:
    repo = DummyFuelExpenseRepository()
    service = FuelExpenseService(repo)

    with pytest.raises(HTTPException):
        service.create_expense({"expense_type": "Toll", "amount": 10, "description": "Toll fee"})
