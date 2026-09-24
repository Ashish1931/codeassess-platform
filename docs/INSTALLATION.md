# Local Installation & Setup Guide

## System Prerequisites
- **Java Development Kit (JDK 17 or Java 21)**
- **Apache Maven 3.8+**
- **Node.js v18+ & npm v9+**
- **MySQL Database Server 8+**

---

## 0. MySQL Database Setup

Create a local MySQL database and user, or use the default local root credentials configured in `backend/src/main/resources/application.properties`.

```sql
CREATE DATABASE IF NOT EXISTS codeassess_db;
```

Default backend datasource values:

```bash
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/codeassess_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
```

If your MySQL password is different, set these environment variables before starting the backend.

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
- Health Check: `http://localhost:8080/api/v1/health`

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

---

## Subscription Plans

- **Free**: 5 test attempts per month, basic score summary.
- **Pro**: 50 test attempts per month, analytics, PDF reports, certificates.
- **Premium**: Unlimited test attempts, all analytics/reporting features, priority support.

Local checkout uses the built-in demo gateway flow from the Subscription page. Paid plan activation is completed by clicking **Confirm Demo Payment** after an order is created.
