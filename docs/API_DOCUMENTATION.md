# REST API Specifications

Base URL: `/api/v1`

## 1. Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates user credentials & returns JWT bearer token. |
| `POST` | `/auth/register` | Public | Registers a new student account with validations. |
| `POST` | `/auth/forgot-password` | Public | Generates password reset token. |
| `POST` | `/auth/reset-password` | Public | Resets user password using valid token. |
| `POST` | `/auth/google` | Public | OAuth2 Google login handshake. |

## 2. User & Student Endpoints (`/api/v1/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/profile` | Student/Admin | Fetches authenticated user profile. |
| `PUT` | `/users/profile` | Student/Admin | Updates user profile details. |
| `POST` | `/users/change-password` | Student/Admin | Updates account password. |
| `GET` | `/users/dashboard` | Student | Returns student dashboard stats & performance arrays. |

## 3. Subject Endpoints (`/api/v1/subjects`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/subjects` | Public | Fetches all programming subjects. |
| `GET` | `/subjects/{id}` | Public | Fetches subject details by ID. |
| `POST` | `/subjects` | Admin | Creates a new programming subject. |
| `PUT` | `/subjects/{id}` | Admin | Updates subject details. |
| `DELETE` | `/subjects/{id}` | Admin | Deletes subject. |

## 4. Test Endpoints (`/api/v1/tests`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/tests` | Public | Fetches all tests. |
| `GET` | `/tests/subject/{subjectId}` | Public | Fetches tests belonging to a subject. |
| `POST` | `/tests` | Admin | Creates a mock test. |
| `PUT` | `/tests/{id}` | Admin | Updates test details. |
| `PATCH` | `/tests/{id}/status` | Admin | Updates status (`DRAFT`, `PUBLISHED`, `EXPIRED`). |

## 5. Exam & Result Endpoints (`/api/v1/exams`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/exams/start/{testId}` | Student | Initiates an exam attempt & starts timer. |
| `POST` | `/exams/submit` | Student | Submits exam answers, triggers grading algorithm. |
| `GET` | `/exams/result/{attemptId}` | Student/Admin | Retrieves attempt result & solution breakdown. |

## 6. Subscription & Payment Endpoints (`/api/v1/subscriptions`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/subscriptions/plans` | Student/Admin | Lists Free, Pro, and Premium plan metadata. |
| `GET` | `/subscriptions/current` | Student/Admin | Returns the authenticated user's active plan. |
| `POST` | `/subscriptions/checkout` | Student | Creates a local demo payment order or activates Free immediately. |
| `POST` | `/subscriptions/confirm` | Student | Confirms a demo payment order and activates the selected paid plan. |
| `POST` | `/subscriptions/cancel` | Student | Cancels the active paid plan and moves the user to Free. |
