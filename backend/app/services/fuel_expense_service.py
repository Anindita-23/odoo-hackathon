from __future__ import annotations

from typing import Any, Protocol

from fastapi import HTTPException, status


class FuelExpenseRepositoryProtocol(Protocol):
    def get_trip(self, trip_id: int) -> dict[str, Any] | None:
        ...

    def get_vehicle(self, vehicle_id: int) -> dict[str, Any] | None:
        ...

    def create_fuel_log(self, data: dict[str, Any]) -> dict[str, Any]:
        ...

    def create_expense(self, data: dict[str, Any]) -> dict[str, Any]:
        ...


class FuelExpenseService:
    def __init__(self, repository: FuelExpenseRepositoryProtocol) -> None:
        self.repository = repository

    def create_fuel_log(self, data: dict[str, Any]) -> dict[str, Any]:
        trip = self.repository.get_trip(data["trip_id"])
        if trip is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

        vehicle = self.repository.get_vehicle(data["vehicle_id"])
        if vehicle is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

        if trip["vehicle_id"] != data["vehicle_id"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicle does not match trip")

        if trip["status"] == "CANCELLED":
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Trip is cancelled")

        return self.repository.create_fuel_log(data)

    def create_expense(self, data: dict[str, Any]) -> dict[str, Any]:
        vehicle_id = data.get("vehicle_id")
        trip_id = data.get("trip_id")

        if vehicle_id is None and trip_id is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Expense must belong to vehicle, trip, or both")

        if vehicle_id is not None:
            vehicle = self.repository.get_vehicle(vehicle_id)
            if vehicle is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found")

        if trip_id is not None:
            trip = self.repository.get_trip(trip_id)
            if trip is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

        return self.repository.create_expense(data)
