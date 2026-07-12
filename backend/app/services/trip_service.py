from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.base import DriverStatus, TripStatus, VehicleStatus
from app.models.driver import Driver
from app.models.trip import Trip
from app.models.vehicle import Vehicle


class TripService:
    def __init__(self, db: Session):
        self.db = db

    def create_trip(self, payload):
        # Fetch vehicle
        vehicle = (
            self.db.query(Vehicle)
            .filter(Vehicle.id == payload.vehicle_id)
            .first()
        )

        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )

        # Fetch driver
        driver = (
            self.db.query(Driver)
            .filter(Driver.id == payload.driver_id)
            .first()
        )

        if driver is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driver not found",
            )

        # Vehicle availability
        if vehicle.status != VehicleStatus.AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Vehicle is not available",
            )

        # Driver availability
        if driver.status != DriverStatus.AVAILABLE:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Driver is not available",
            )

        # Capacity check
        if payload.cargo_weight > vehicle.max_load_capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cargo exceeds vehicle capacity",
            )

        # Vehicle active trip check
        active_vehicle_trip = (
            self.db.query(Trip)
            .filter(
                Trip.vehicle_id == payload.vehicle_id,
                Trip.status == TripStatus.DISPATCHED,
            )
            .first()
        )

        if active_vehicle_trip:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Vehicle already assigned to another trip",
            )

        # Driver active trip check
        active_driver_trip = (
            self.db.query(Trip)
            .filter(
                Trip.driver_id == payload.driver_id,
                Trip.status == TripStatus.DISPATCHED,
            )
            .first()
        )

        if active_driver_trip:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Driver already assigned to another trip",
            )

        trip = Trip(
            vehicle_id=payload.vehicle_id,
            driver_id=payload.driver_id,
            source=payload.source,
            destination=payload.destination,
            cargo_weight=payload.cargo_weight,
            planned_distance=payload.planned_distance,
            actual_distance=payload.actual_distance,
            revenue=payload.revenue,
            fuel_used=payload.fuel_used,
            final_odometer=payload.final_odometer,
            status=TripStatus.DISPATCHED,
            dispatch_time=datetime.utcnow(),
            created_at=datetime.utcnow(),
        )

        self.db.add(trip)

        vehicle.status = VehicleStatus.ON_TRIP
        driver.status = DriverStatus.ON_TRIP

        self.db.commit()
        self.db.refresh(trip)

        return {
            "success": True,
            "message": "Trip created successfully",
            "data": trip,
        }

    def complete_trip(
        self,
        trip_id: int,
        final_odometer: float,
        actual_distance: float,
        fuel_used: float,
    ):
        trip = (
            self.db.query(Trip)
            .filter(Trip.id == trip_id)
            .first()
        )

        if trip is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found",
            )

        vehicle = (
            self.db.query(Vehicle)
            .filter(Vehicle.id == trip.vehicle_id)
            .first()
        )

        driver = (
            self.db.query(Driver)
            .filter(Driver.id == trip.driver_id)
            .first()
        )

        trip.status = TripStatus.COMPLETED
        trip.actual_distance = actual_distance
        trip.fuel_used = fuel_used
        trip.final_odometer = final_odometer
        trip.completion_time = datetime.utcnow()

        if vehicle:
            vehicle.status = VehicleStatus.AVAILABLE
            vehicle.odometer = final_odometer

        if driver:
            driver.status = DriverStatus.AVAILABLE

        self.db.commit()
        self.db.refresh(trip)

        return {
            "success": True,
            "message": "Trip completed successfully",
            "data": trip,
        }