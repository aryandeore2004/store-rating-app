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

## Author

**Aryan Deore**

Computer Engineering

Modern Education Society's Wadia College of Engineering, Pune
