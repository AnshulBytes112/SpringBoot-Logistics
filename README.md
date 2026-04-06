# 🚚 SpringBoot Logistics — Full-Stack Load & Booking Management System

A modern freight logistics platform connecting **Shippers** (who post cargo loads) with **Transporters** (who bid on jobs). Built with **Spring Boot** backend and **React + Tailwind CSS** frontend featuring live GPS tracking, role-based access control, and a glassmorphic dark UI.

---

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based authentication with secure token management
- Role selection at registration — **Shipper**, **Transporter**, or **Admin**
- JWT tokens contain user profile (`firstname`, `role`) for client-side gating
- Show/hide password toggle on login/register forms

### 📦 Load Management
- **Shippers/Admins** can post new loads with full details:
  - Origin & destination cities
  - Product type, truck type (dropdown), truck count, weight
  - Loading & unloading dates
  - GPS coordinates — **auto-detected** from city name via OpenStreetMap Nominatim geocoder
  - Comments & special instructions
- All loads display as cards with route, details, status badge, shipment tracker, and live map
- Soft-delete loads (Shippers can delete **own loads only**; Admins can delete **any**)

### 🤝 Booking / Proposal System
- **Transporters/Admins** can submit proposals (proposed rate + terms) on `POSTED` loads
- **Shippers/Admins** can accept or reject proposals from the Bookings Management tab
- Accepting a booking auto-updates the load status to `BOOKED`
- Admins can remove bookings entirely

### 📊 Analytics Dashboard
- Real-time metrics: Total Loads, Active/Unbooked, Dispatched, Secured Revenue (₹)
- Fulfillment percentage ring gauge
- Recent bookings activity feed with color-coded status dots

### 🗺️ Live Map Tracking
- Each load card renders an interactive **Leaflet/OpenStreetMap** map
- GPS marker pinned at the load's origin coordinates
- CartoDB Dark tiles matching the UI theme

### 🔒 Role-Based UI Gating

| Action | 🟡 Shipper | 🔵 Transporter | 🟢 Admin |
|---|:---:|:---:|:---:|
| Post a Load | ✅ | ❌ | ✅ |
| Submit Proposal | ❌ | ✅ | ✅ |
| Delete Load | ✅ own only | ❌ | ✅ any |
| View Bookings tab | ✅ | ❌ | ✅ |
| Accept/Reject Booking | ✅ | ❌ | ✅ |
| Remove Booking | ❌ | ❌ | ✅ |

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3, Spring Data JPA, Spring Security
- **Database**: PostgreSQL (Neon DB cloud)
- **Auth**: JWT (access + refresh tokens)
- **Caching**: Caffeine (in-memory)
- **Docs**: springdoc-openapi (Swagger UI)
- **Build**: Maven Wrapper

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (glassmorphism dark theme)
- **Maps**: React-Leaflet + OpenStreetMap
- **Geocoding**: Nominatim (free, no API key)
- **Font**: Google Fonts — Outfit

---

## ⚙️ Setup & Run

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL (or use the configured Neon DB connection)

### 1. Clone the repository
```bash
git clone https://github.com/Adityarajj23/SpringBoot-Logistics.git
cd SpringBoot-Logistics
```

### 2. Configure Database
Edit `src/main/resources/application.yml` with your PostgreSQL credentials, or use the default Neon DB config.

### 3. Start Backend (Terminal 1)
```bash
.\mvnw.cmd spring-boot:run     # Windows
./mvnw spring-boot:run          # Mac/Linux
```
Backend runs on: `http://localhost:8081`

### 4. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 5. Open the App
Navigate to `http://localhost:5173` in your browser.

---

## 🔹 API Endpoints

**Base URL**: `http://localhost:8081`

**Swagger UI**: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)

### 🔑 Auth (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user (with role) |
| POST | `/api/auth/authenticate` | Login and receive JWT token |

### 📦 Load Management (`/api/loads`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/loads` | Create a new load |
| GET | `/api/loads` | Get loads (filter by `shipperId`, `productType`, `truckType`) |
| GET | `/api/loads/{loadId}` | Get a specific load |
| PUT | `/api/loads/{loadId}` | Update a load |
| DELETE | `/api/loads/{loadId}` | Soft-delete a load |

### 🚚 Booking Management (`/api/bookings`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/bookings` | Create a booking proposal |
| GET | `/api/bookings` | Get bookings (filter by `transporterId`, `proposedRate`) |
| GET | `/api/bookings/{id}` | Get a specific booking |
| PUT | `/api/bookings/{id}` | Update a booking (status change → ACCEPTED triggers load BOOKED) |
| DELETE | `/api/bookings/{id}` | Soft-delete a booking |

---

## 📜 Data Models

### Load
```json
{
  "id": "UUID",
  "shipperId": "String",
  "productType": "String",
  "truckType": "FLATBED | OPEN_BODY | REEFER | CONTAINER | TANKER | TRAILER",
  "noOfTrucks": "int",
  "weight": "double",
  "comment": "String",
  "status": "POSTED | BOOKED | CANCELLED",
  "currentLat": "Double",
  "currentLng": "Double",
  "facility": {
    "loadPoint": "String",
    "unloadingPoint": "String",
    "loadingDate": "ISO-8601",
    "unloadingDate": "ISO-8601"
  }
}
```

### Booking
```json
{
  "id": "UUID",
  "loadId": "UUID",
  "transporterId": "String",
  "proposedRate": "Double",
  "comment": "String",
  "status": "PENDING | ACCEPTED | REJECTED"
}
```

---

## 📂 Project Structure

```
SpringBoot-Logistics/
├── src/main/java/com/sdeintern1/Logistics/
│   ├── Controller/        # REST controllers (LoadController, BookingController)
│   ├── DTO/               # Request/Response DTOs
│   ├── Entity/            # JPA entities (Load, Booking, User)
│   ├── Mapper/            # MapStruct mappers
│   ├── Repository/        # Spring Data JPA repositories
│   ├── Security/          # JWT auth, filters, config
│   ├── Service/           # Business logic
│   └── Specification/     # JPA Specifications for filtering
├── src/main/resources/
│   └── application.yml    # Config (DB, JWT, caching)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx          # Login/Register with role picker
│   │   │   ├── Dashboard.jsx     # Analytics dashboard
│   │   │   ├── LoadBoard.jsx     # Load cards + Bookings management
│   │   │   ├── CreateLoadModal.jsx    # Post load form (with geocoding)
│   │   │   ├── CreateBookingModal.jsx # Submit proposal form
│   │   │   ├── LiveMap.jsx       # Leaflet map component
│   │   │   └── ShipmentTracker.jsx    # Visual progress tracker
│   │   ├── App.jsx         # Main app with JWT auth & routing
│   │   └── index.css       # Tailwind + custom theme
│   └── package.json
└── README.md
```

---

## 🧪 Testing Workflow

1. **Register as Shipper** (`alice@test.com`) → Post 2 loads with GPS
2. **Register as Transporter** (`bob@test.com`) → Submit proposals on loads
3. **Register as Admin** (`admin@test.com`) → Accept/reject proposals, verify load status updates
4. **Dashboard** → Check real-time analytics (revenue, fulfillment %)

All passwords: use any password you choose (min length enforced).

---

## 🧠 Key Design Decisions
- **JWT with embedded claims**: `firstname` and `role` are encoded in the token, eliminating extra API calls for profile data
- **Frontend role gating**: UI buttons/tabs are conditionally rendered based on decoded JWT — no backend round-trips
- **Auto-geocoding**: City names are resolved to GPS coordinates via free Nominatim API (no API key needed)
- **204 handling**: Backend returns `204 No Content` for empty lists; frontend handles gracefully
- **Soft deletes**: Both loads and bookings use `@SQLDelete` for audit-safe deletion

---

Made by **Aditya Raj**
