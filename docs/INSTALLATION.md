# Local Installation & Setup Guide

## System Prerequisites
- **Java Development Kit (JDK 17 or Java 21)**
- **Apache Maven 3.8+**
- **Node.js v18+ & npm v9+**
- **MySQL Database Server (Optional, H2 in-memory active by default)**

---

## 1. Backend Setup (Spring Boot)

```bash
cd backend

# Compile & verify dependencies
mvn clean test-compile

# Launch Spring Boot Application (Port 8080)
mvn spring-boot:run
```

- API Base Endpoint: `http://localhost:8080/api/v1`
- H2 In-Memory Console: `http://localhost:8080/api/v1/h2-console` (JDBC URL: `jdbc:h2:mem:codeassessdb`, User: `sa`, Password: `password`)

---

## 2. Frontend Setup (React SPA)

```bash
cd frontend

# Install Node modules
npm install

# Start Vite Development Server (Port 5173)
npm run dev
```

- Web Interface: `http://localhost:5173`

---

## Default Credentials
- **Student User**: `student@codeassess.com` / `Student@1234`
- **Admin User**: `admin@codeassess.com` / `Admin@1234`
