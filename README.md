# Store Rating App

## Developed By

**Aryan Deore**

## Project Overview

Store Rating App is a full-stack web application that allows users to rate stores on a scale of 1 to 5. The application provides role-based access control with separate functionalities for System Administrators, Normal Users, and Store Owners.

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* MySQL
* Maven

### Frontend

* ReactJS
* Axios
* Bootstrap

## Features

### System Administrator

* Add new users
* Add new stores
* View all users
* View all stores
* Search and filter records
* Dashboard showing:

  * Total Users
  * Total Stores
  * Total Ratings

### Normal User

* Register and Login
* View all stores
* Search stores by name and address
* Submit ratings (1–5)
* Update ratings
* Change password

### Store Owner

* Login
* View average store rating
* View users who submitted ratings
* Change password

## Database Tables

### Users

* Id
* Name
* Email
* Password
* Address
* Role

### Stores

* Id
* Name
* Email
* Address
* Owner Id

### Ratings

* Id
* User Id
* Store Id
* Rating

## Project Structure

```text
store-rating-app
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── application.properties
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## Installation and Setup

### Clone Repository

```bash
git clone https://github.com/your-username/store-rating-app.git
cd store-rating-app
```

### Backend Setup

Configure MySQL credentials in:

```properties
backend/src/main/resources/application.properties
```

Run Backend:

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

## Validation Rules

### Name

* Minimum 20 characters
* Maximum 60 characters

### Address

* Maximum 400 characters

### Password

* 8 to 16 characters
* At least one uppercase letter
* At least one special character

### Email

* Must follow standard email format

## Learning Outcomes

* Spring Boot REST API Development
* React Frontend Development
* JWT Authentication and Authorization
* Role-Based Access Control
* MySQL Database Design
* Full-Stack Application Development

# Deployment Guide

## Overview

The Store Rating App is deployed using the following services:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Aiven MySQL
* **Source Control:** GitHub

---

## 1. Database Deployment (Aiven MySQL)

A cloud-hosted MySQL database was created using Aiven.

### Database Configuration

* Database Provider: Aiven
* Database Engine: MySQL
* SSL Enabled: Yes

The following database credentials were obtained from the Aiven dashboard:

* Host
* Port
* Database Name
* Username
* Password

These credentials were later used as environment variables in Render.

---

## 2. Source Code Management (GitHub)

The complete project was pushed to GitHub.

### Repository Structure

```text
store-rating-app
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── README.md
```

### Git Commands Used

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```

---

## 3. Backend Deployment (Render)

The Spring Boot backend application was deployed using Render.

### Docker Configuration

A Dockerfile was created inside the backend folder to build and run the Spring Boot application.

### Environment Variables

The following variables were configured in Render:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET
CORS_ALLOWED_ORIGIN
```

### Database Connection

Render connects to the Aiven MySQL database using the provided credentials.

### Backend URL

```text
https://store-rating-app-jd5t.onrender.com
```

### Deployment Verification

The backend deployment was verified by accessing:

```text
https://store-rating-app-jd5t.onrender.com/api/auth/login
```

A Method Not Allowed (405) response confirmed that the API was running correctly and waiting for POST requests.

---

## 4. Frontend Deployment (Vercel)

The React application was deployed using Vercel.

### Project Configuration

* Framework: React
* Root Directory: frontend

### Environment Variable

```text
REACT_APP_API_URL=https://store-rating-app-jd5t.onrender.com/api
```

This allows the React frontend to communicate with the deployed backend.

### Frontend URL

```text
https://store-rating-app-opal.vercel.app
```

---

## 5. CORS Configuration

To allow communication between the frontend and backend, Cross-Origin Resource Sharing (CORS) was configured.

### Security Configuration

The backend uses Spring Security and dynamically loads allowed origins using environment variables.

```java
@Value("${app.cors.allowed-origin}")
private String allowedOrigins;
```

```java
configuration.setAllowedOrigins(
    List.of(allowedOrigins.split(","))
);
```

### Render Environment Variable

```text
CORS_ALLOWED_ORIGIN=https://store-rating-app-opal.vercel.app
```

This ensures that only the deployed frontend can access backend APIs.

---

## 6. Production Configuration

The application uses environment variables for production deployment.

### application.properties

```properties
server.port=${PORT:8080}

spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

jwt.secret=${JWT_SECRET}

app.cors.allowed-origin=${CORS_ALLOWED_ORIGIN}
```

This approach avoids hardcoding sensitive credentials and allows different configurations for local development and production.

---

## 7. Final Deployment Architecture

```text
React Frontend (Vercel)
           │
           ▼
Spring Boot Backend (Render)
           │
           ▼
Aiven MySQL Database
```

---

## Deployment Outcome

Successfully deployed a full-stack Store Rating Application using:

* ReactJS
* Spring Boot
* Spring Security
* JWT Authentication
* MySQL
* Aiven Cloud Database
* Render
* Vercel
* GitHub

The application supports role-based authentication, store management, rating submission, and cloud-based deployment.


## Author

**Aryan Deore**

Computer Engineering

Modern Education Society's Wadia College of Engineering, Pune
