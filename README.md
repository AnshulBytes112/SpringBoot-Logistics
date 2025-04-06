# 🚚 SpringBoot Logistics - Load & Booking Management System

This is a backend logistics management system built using **Spring Boot** and **PostgreSQL**, focused on efficient load posting, filtering, and booking management.

---

## 📦 Features

- Create, update, and manage shipping loads.
- Book loads with transporter details.
- Status tracking for both loads and bookings.
- RESTful APIs with Swagger documentation.
- Error handling with proper response codes.

---

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3, Spring Data JPA
- **Database**: PostgreSQL
- **API Documentation**: springdoc-openapi (Swagger UI)
- **Build Tool**: Maven
- **Testing**: POSTMAN

---

## ⚙️ Setup Instructions

### 1. Clone the repository

bash
git clone https://github.com/AnshulBytes112/SpringBoot-Logistics.git
cd SpringBoot-Logistics

### 2. Configure PostgreSQL
Ensure PostgreSQL is installed and running. Then create a database:

CREATE DATABASE logistics_db;

Edit src/main/resources/application.properties:

In application.properties 

spring.datasource.url=jdbc:postgresql://localhost:5432/logistics_db
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true


#3# 3.Run the application
 
Via terminal:
./mvnw spring-boot:run

Or run 
LogisticsApplication.java directly in your IDE (IntelliJ/VS Code).

### 4.API Usage
Base URL: http://localhost:8080

Swagger UI
API documentation available at:

http://localhost:8080/swagger-ui.html

📜 API Specifications

📦 Load Entity

{
  "id": "UUID",
  "shipperId": "String",
  "facility": {
    "loadingPoint": "String",
    "unloadingPoint": "String",
    "loadingDate": "Timestamp",
    "unloadingDate": "Timestamp"
  },
  "productType": "String",
  "truckType": "String",
  "noOfTrucks": "int",
  "weight": "double",
  "comment": "String",
  "datePosted": "Timestamp",
  "status": "POSTED | BOOKED | CANCELLED"
}

✅ Rules:

Status defaults to POSTED when a load is created.
When a booking is made (POST /booking), the associated load’s status changes to BOOKED.
If a booking is deleted, the load status becomes CANCELLED.

📑 Booking Entity

{
  "id": "UUID",
  "loadId": "UUID",
  "transporterId": "String",
  "proposedRate": "double",
  "comment": "String",
  "status": "PENDING | ACCEPTED | REJECTED",
  "requestedAt": "Timestamp"
}
✅ Rules:

A booking is not allowed if the associated load is CANCELLED.

When a booking is accepted (PUT /booking/{id}), its status updates to ACCEPTED.

🔹 API Endpoints

🏗️ Load Management

Method	            Endpoint	          Description

POST	              /load	              Create a new load
GET	                /load	              Fetch loads with filters
GET	                /load/{loadId}	    Get details of a specific load
PUT	                /load/{loadId}	    Update a load
DELETE	            /load/{loadId}	    Delete a load

🚚 Booking Management

Method	            Endpoint	              Description
POST	              /booking	              Create a new booking
GET	                /booking	              Fetch bookings (filter support)
GET	                /booking/{bookingId}	  Get details of a specific booking
PUT	                /booking/{bookingId}	  Update a booking
DELETE	            /booking/{bookingId}	  Delete a booking

🧠 Assumptions
1) The id field is intentionally hidden from Swagger for security, but it is included in API responses can be checked by POSTMAN.
2)Filtering is strictly limited to shipperId, productType, and truckType to avoid misuse.
3) Status can be one of: POSTED, BOOKED, CANCELLED. Default is POSTED.
4) Timestamps follow ISO 8601 format (UTC).
5) All APIs return appropriate HTTP status codes and error messages.

🧪 Testing
You can test endpoints directly using Swagger or tools like Postman(it will help to access load id which cannot be accessed directly from Swagger).

Made by Anshul Prakash
