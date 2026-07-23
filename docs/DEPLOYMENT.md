# Production Deployment Guide

This guide details step-by-step instructions for deploying the **Programming Learning & Assessment Platform** ("CodeAssess Pro") to cloud infrastructure.

---

## 1. Database Deployment (MySQL Cloud)

You can use any managed cloud MySQL database provider such as **Aiven for MySQL**, **Railway MySQL**, **PlanetScale**, or **AWS RDS**.

1. Create a MySQL database instance (e.g. `codeassess_db`).
2. Execute the schema initialization script located at `backend/src/main/resources/schema.sql` to create normalized tables and constraints.
3. Save your connection details:
   - Host / URL: `jdbc:mysql://<cloud-db-host>:3306/codeassess_db?useSSL=true`
   - DB Username
   - DB Password

---

## 2. Backend Deployment (Render.com)

Deploy the Java 17/21 Spring Boot REST API as a Web Service on **Render**.

1. Push your repository to GitHub.
2. In Render Dashboard, click **New +** -> **Web Service**.
3. Connect your GitHub repository and select the `backend` root folder.
4. Configure settings:
   - **Environment**: `Java`
   - **Build Command**: `./mvnw clean package -DskipTests` (or `mvn clean package -DskipTests`)
   - **Start Command**: `java -jar target/codeassess-backend-1.0.0.jar --spring.profiles.active=prod`
5. Add Environment Variables:
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<cloud-db-host>:3306/codeassess_db`
   - `SPRING_DATASOURCE_USERNAME`: `<db_username>`
   - `SPRING_DATASOURCE_PASSWORD`: `<db_password>`
   - `JWT_SECRET`: `9a6e8b12f4c78103c81e1f43a9b74052e18d6174a89052b61a3845d01e4a78bc`
   - `ALLOWED_ORIGINS`: `https://codeassess-pro.vercel.app`
6. Click **Deploy Web Service**. Once live, note down your backend URL: `https://codeassess-backend.onrender.com/api/v1`.

---

## 3. Frontend Deployment (Vercel)

Deploy the React SPA on **Vercel**.

1. In Vercel Dashboard, click **Add New...** -> **Project**.
2. Select your repository and pick the `frontend` root directory.
3. Framework Preset: **Vite**.
4. Configure Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Configure Environment / Rewrite rules in `vercel.json` for single-page routing:

```json
{
  "rewrites": [
    { "source": "/api/v1/:path*", "destination": "https://codeassess-backend.onrender.com/api/v1/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

6. Click **Deploy**. Your EdTech assessment web app will be live at `https://codeassess-pro.vercel.app`.
