# CodeAssess Pro - Programming Learning & Assessment Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-green.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![Java](https://img.shields.io/badge/Java-17%20%7C%2021-orange.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

**CodeAssess Pro** is a full-stack, enterprise-grade online examination & programming learning platform designed for computer science students and software engineering candidates. The platform enables students to register, attempt live-timed MCQ assessments, analyze subject performance, export official PDF report cards, and practice programming concepts across **8 core subjects**:

- **Data Structures (DSA)**
- **C++**
- **Java**
- **Python**
- **SQL**
- **DBMS**
- **Operating System (OS)**
- **Computer Networks (CN)**

---

## Key Features & Highlights

### For Students
- **Live Timed Examination Engine**: Real-time countdown timer, question palette grid, status tracking (Answered, Marked for Review, Unanswered), anti-cheat refresh warnings, and auto-submission on timeout.
- **Granular Solution Review & Analytics**: Instant score calculation, percentage, pass/fail status, topic breakdown, and detailed code-level solution explanations for every MCQ.
- **Visual Performance Analytics**: Interactive line charts for score trends, bar charts for subject accuracy, pie charts for correct/wrong ratios, and weak topic identification.
- **PDF Report & Certificate Generation**: Client-side and server-side PDF export of official transcripts and certificates using HTML2Canvas & jsPDF.
- **Gamification & Practice**: Global leaderboards, daily challenge streaks (+50 XP), question bookmarking, and wrong answers practice mode.
- **Subscriptions & Payments**: Free, Pro, and Premium plans with a local demo payment gateway flow and monthly attempt limits.

### For Administrators
- **Complete Content Management (CRUD)**: Create, update, and manage Students, Subjects, Mock Test Papers, and MCQ Question Banks.
- **Publish & Visibility Control**: Set test difficulty (EASY, MEDIUM, HARD), passing marks, duration, and status transitions (`DRAFT`, `PUBLISHED`, `EXPIRED`, `RESULT_PUBLISHED`).
- **Platform Analytics**: Monitor total student enrollments, test attempts today, global average scores, highest/lowest marks, and pending results.

---

## Tech Stack & Clean Architecture

### Frontend (`/frontend`)
- **Core**: React 18 (Vite SPA framework)
- **Styling**: Modern Glassmorphism & Custom CSS variables (Dark/Light mode support)
- **State & Routing**: Context API (`AuthContext`, `ThemeContext`, `ExamContext`), React Router v6
- **HTTP & Visuals**: Axios with JWT Interceptors, Recharts, Lucide React Icons, jsPDF & html2canvas

### Backend (`/backend`)
- **Core**: Java 17/21, Spring Boot 3.2.3, Maven
- **Security**: Spring Security 6, JWT Stateless Token Provider, BCrypt Password Encoder, Google OAuth2 support
- **Persistence**: Spring Data JPA, Hibernate ORM, MySQL
- **Architecture**: Layered Architecture (Controller -> Service -> Repository -> Entity) with DTO Pattern & Builder Pattern

---

## Project Structure

```
MCQ/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/codeassess/
│       ├── config/           # Security, Web, Cors & DataSeeder
│       ├── controller/       # REST API Controllers
│       ├── dto/              # Request / Response DTOs
│       ├── entity/           # JPA Entities (User, Test, Question, Result, etc.)
│       ├── enums/            # RoleName, DifficultyLevel, TestStatus
│       ├── exception/        # Custom Exceptions & GlobalExceptionHandler
│       ├── repository/       # Spring Data JPA Repositories
│       └── service/          # Service Interfaces & Implementations
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── components/       # Navbar, Sidebar, Timer, QuestionPalette, etc.
│       ├── context/          # Auth, Theme & Exam Context Providers
│       ├── pages/            # Student & Admin Dashboards, Exams, Reports
│       └── services/         # Axios API Client
└── docs/                     # Comprehensive Architecture & Diagram Files
    ├── ER_DIAGRAM.md
    ├── USE_CASE_DIAGRAM.md
    ├── SEQUENCE_DIAGRAM.md
    ├── CLASS_DIAGRAM.md
    ├── ACTIVITY_DIAGRAM.md
    ├── FLOWCHART.md
    ├── API_DOCUMENTATION.md
    ├── INSTALLATION.md
    └── DEPLOYMENT.md
```

---

## System Architecture Diagrams

All system design diagrams are formatted in GitHub Flavored Markdown (Mermaid):
- [ER Diagram](file:///home/ashish/Desktop/MCQ/docs/ER_DIAGRAM.md)
- [Use Case Diagram](file:///home/ashish/Desktop/MCQ/docs/USE_CASE_DIAGRAM.md)
- [Sequence Diagram](file:///home/ashish/Desktop/MCQ/docs/SEQUENCE_DIAGRAM.md)
- [Class Diagram](file:///home/ashish/Desktop/MCQ/docs/CLASS_DIAGRAM.md)
- [Activity Diagram](file:///home/ashish/Desktop/MCQ/docs/ACTIVITY_DIAGRAM.md)
- [System Flowchart](file:///home/ashish/Desktop/MCQ/docs/FLOWCHART.md)

---

## Quick Start (Local Setup)

```bash
# 1. Create or confirm MySQL database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS codeassess_db;"

# 2. Start Spring Boot Backend
cd backend
mvn spring-boot:run

# 3. Start React Frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

- **Student Login**: `student@codeassess.com` / `Student@1234`
- **Admin Login**: `admin@codeassess.com` / `Admin@1234`

Local paid-plan checkout is available under the student **Subscription** page and uses the built-in demo gateway confirmation flow.
