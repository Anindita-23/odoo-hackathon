from __future__ import annotations

from typing import Any

import pytest
from fastapi import HTTPException

from app.services.trip_service import TripService


class DummyRepository:
    def __init__(self) -> None:
        self.vehicles = {
            1: {
                "id": 1,
                "registration_number": "ABC-123",
                "vehicle_name": "Bus A",
                "vehicle_type": "Bus",
                "max_load_capacity": 12000,
                "odometer": 1000,
                "acquisition_cost": 50000,
                "status": "AVAILABLE",
                "region": "North",
            }
        }
        self.drivers = {
            1: {
                "id": 1,
                "name": "Alice",
                "license_number": "LIC-001",
                "license_category": "A",
                "license_expiry": "2030-01-01",
                "contact_number": "1234567890",
                "safety_score": 95,
                "status": "AVAILABLE",
            }
        }
        self.active_trips = []
        self.trips = []

    def get_vehicle(self, vehicle_id: int) -> dict[str, Any] | None:
        return self.vehicles.get(vehicle_id)

    def get_driver(self, driver_id: int) -> dict[str, Any] | None:
        return self.drivers.get(driver_id)

    def get_active_trip_for_vehicle(self, vehicle_id: int) -> dict[str, Any] | None:
        for trip in self.active_trips:
            if trip["vehicle_id"] == vehicle_id:
                return trip
        return None

    def get_active_trip_for_driver(self, driver_id: int) -> dict[str, Any] | None:
        for trip in self.active_trips:
            if trip["driver_id"] == driver_id:
                return trip
        return None

    def create_trip(self, data: dict[str, Any]) -> dict[str, Any]:
        trip = {
            "id": len(self.trips) + 1,
            "status": "DISPATCHED",
            **data,
        }
        self.trips.append(trip)
        self.active_trips.append(trip)
        return trip

    def update_vehicle(self, vehicle_id: int, **updates: Any) -> dict[str, Any]:
        vehicle = self.vehicles[vehicle_id]
        vehicle.update(updates)
        return vehicle

    def update_driver(self, driver_id: int, **updates: Any) -> dict[str, Any]:
        driver = self.drivers[driver_id]
        driver.update(updates)
        return driver

    def get_trip(self, trip_id: int) -> dict[str, Any] | None:
        for trip in self.trips:
            if trip["id"] == trip_id:
                return trip
        return None

    def update_trip(self, trip_id: int, **updates: Any) -> dict[str, Any]:
        trip = self.get_trip(trip_id)
        if trip is None:
            raise KeyError(trip_id)
        trip.update(updates)
        return trip


def test_create_trip_dispatches_vehicle_and_driver() -> None:
    repo = DummyRepository()
    service = TripService(repo)

    trip = service.create_trip(
        {
            "vehicle_id": 1,
            "driver_id": 1,
            "source": "A",
            "destination": "B",
            "cargo_weight": 10000,
            "planned_distance": 200,
            "actual_distance": 0,
            "revenue": 0,
            "fuel_used": 0,
            "final_odometer": 0,
        }
    )

    assert trip["status"] == "DISPATCHED"
    assert repo.vehicles[1]["status"] == "ON_TRIP"
    assert repo.drivers[1]["status"] == "ON_TRIP"


def test_create_trip_rejects_vehicle_in_shop() -> None:
    repo = DummyRepository()
    repo.vehicles[1]["status"] = "IN_SHOP"
    service = TripService(repo)

    with pytest.raises(HTTPException):
        service.create_trip(
            {
                "vehicle_id": 1,
                "driver_id": 1,
                "source": "A",
                "destination": "B",
                "cargo_weight": 10000,
                "planned_distance": 200,
                "actual_distance": 0,
                "revenue": 0,
                "fuel_used": 0,
                "final_odometer": 0,
            }
        )


def test_complete_trip_clears_vehicle_and_driver_status() -> None:
    repo = DummyRepository()
    service = TripService(repo)
    trip = service.create_trip(
        {
            "vehicle_id": 1,
            "driver_id": 1,
            "source": "A",
            "destination": "B",
            "cargo_weight": 10000,
            "planned_distance": 200,
            "actual_distance": 0,
            "revenue": 0,
            "fuel_used": 0,
            "final_odometer": 0,
        }
    )

    completed = service.complete_trip(
        trip_id=trip["id"],
        final_odometer=1500,
        actual_distance=250,
        fuel_used=40,
    )

    assert completed["status"] == "COMPLETED"
    assert repo.vehicles[1]["status"] == "AVAILABLE"
    assert repo.drivers[1]["status"] == "AVAILABLE"
    assert repo.vehicles[1]["odometer"] == 1500
