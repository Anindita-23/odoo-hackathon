from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db
from app.schemas import (
    ExpenseCreateRequest,
    FuelLogCreateRequest,
    MaintenanceCreateRequest,
    TripCompleteRequest,
    TripCreateRequest,
)
from app.services.trip_service import TripService

router = APIRouter(prefix="/api", tags=["TransitOps"])


# -------------------------
# Trip Routes
# -------------------------

@router.post("/trips", status_code=201)
async def create_trip(
    payload: TripCreateRequest,
    db: Session = Depends(get_db),
):
    service = TripService(db)
    return service.create_trip(payload)


@router.post("/trips/{trip_id}/complete")
async def complete_trip(
    trip_id: int,
    payload: TripCompleteRequest,
    db: Session = Depends(get_db),
):
    service = TripService(db)
    return service.complete_trip(
        trip_id,
        payload.final_odometer,
        payload.actual_distance,
        payload.fuel_used,
    )


# -------------------------
# Temporary placeholders
# -------------------------

@router.post("/maintenance", status_code=501)
async def create_maintenance(
    payload: MaintenanceCreateRequest,
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Maintenance service is being migrated.",
    )


@router.post("/maintenance/{maintenance_id}/complete", status_code=501)
async def complete_maintenance(
    maintenance_id: int,
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Maintenance service is being migrated.",
    )


@router.post("/fuel-logs", status_code=501)
async def create_fuel_log(
    payload: FuelLogCreateRequest,
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Fuel service is being migrated.",
    )


@router.post("/expenses", status_code=501)
async def create_expense(
    payload: ExpenseCreateRequest,
):
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Expense service is being migrated.",
    )