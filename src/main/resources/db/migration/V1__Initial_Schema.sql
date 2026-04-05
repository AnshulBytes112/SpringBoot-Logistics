-- Table: _user
CREATE TABLE _user (
    id UUID PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50)
);

-- Table: loads
CREATE TABLE loads (
    id UUID PRIMARY KEY,
    shipper_id VARCHAR(255) NOT NULL,
    product_type VARCHAR(255) NOT NULL,
    truck_type VARCHAR(255) NOT NULL,
    no_of_trucks INTEGER NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    comment TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    load_point VARCHAR(255) NOT NULL,
    unloading_point VARCHAR(255) NOT NULL,
    loading_date TIMESTAMP,
    unloading_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'POSTED',
    created_by VARCHAR(255),
    created_date TIMESTAMP,
    last_modified_by VARCHAR(255),
    last_modified_date TIMESTAMP
);

-- Table: booking
CREATE TABLE booking (
    id UUID PRIMARY KEY,
    load_id UUID NOT NULL,
    transporter_id VARCHAR(255) NOT NULL,
    proposed_rate DOUBLE PRECISION NOT NULL,
    comment TEXT,
    deleted BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_by VARCHAR(255),
    created_date TIMESTAMP,
    last_modified_by VARCHAR(255),
    last_modified_date TIMESTAMP
);
