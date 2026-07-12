
-- ======================================
-- Sample Seed Data
-- ======================================

INSERT INTO vehicles (
    registration_number,
    vehicle_name,
    vehicle_type,
    max_load_capacity,
    odometer,
    acquisition_cost,
    status,
    region,
    created_at,
    updated_at
)
VALUES (
    'KA01AB1234',
    'Tata Ace',
    'Mini Truck',
    1000,
    25000,
    650000,
    'AVAILABLE',
    'Bangalore',
    NOW(),
    NOW()
);

INSERT INTO drivers (
    name,
    license_number,
    license_category,
    license_expiry,
    contact_number,
    safety_score,
    status,
    created_at,
    updated_at
)
VALUES (
    'Ramesh Kumar',
    'DL123456789',
    'LMV',
    '2030-12-31',
    '9876543210',
    95,
    'AVAILABLE',
    NOW(),
    NOW()
);

-- Add more sample data later