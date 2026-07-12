from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class TripCreateRequest(BaseModel):
    vehicle_id: int
    driver_id: int
    source: str = Field(min_length=1)
    destination: str = Field(min_length=1)
    cargo_weight: float
    planned_distance: float
    actual_distance: float = 0
    revenue: float = 0
    fuel_used: float = 0
    final_odometer: float = 0


class TripCompleteRequest(BaseModel):
    final_odometer: float
    actual_distance: float
    fuel_used: float


class MaintenanceCreateRequest(BaseModel):
    vehicle_id: int
    description: str = Field(min_length=1)
    cost: float = 0
    status: str = "ACTIVE"
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class FuelLogCreateRequest(BaseModel):
    vehicle_id: int
    trip_id: int
    liters: float
    cost: float = 0
    log_date: Optional[str] = None


class ExpenseCreateRequest(BaseModel):
    vehicle_id: Optional[int] = None
    trip_id: Optional[int] = None
    expense_type: str = Field(min_length=1)
    amount: float
    description: str = Field(min_length=1)
    expense_date: Optional[str] = None
