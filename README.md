# IntelliHire — AI Powered Recruitment Platform

An intelligent full stack recruitment and job management platform built using Spring Boot, Spring Security, JWT Authentication, Hibernate JPA, MySQL, and REST APIs.

The platform is designed to provide a secure and scalable recruitment ecosystem where candidates and employers can interact through role-based access control and intelligent hiring workflows.

This project is currently under active development.

---

# Project Objective

Traditional job portals mainly focus on basic job listings and applications. IntelliHire aims to enhance the recruitment experience by integrating secure backend architecture with AI-powered recruitment features.

The system focuses on:

- Secure authentication and authorization
- Role-based access management
- Recruitment workflow automation
- AI-driven job recommendation architecture
- Scalable REST API design
- Modern enterprise backend practices

---

# Tech Stack

## Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate ORM
- JWT Authentication
- REST APIs

## Database
- MySQL

## Build Tool
- Maven

## Development Tools
- Spring Tool Suite (STS)
- Postman
- Git & GitHub

## Planned Frontend
- React.js
- Tailwind CSS

## Planned AI Integration
- Spring AI
- Resume Analysis
- AI Job Recommendation Engine
- AI Interview Question Generation

---

# Core Features

## Authentication & Authorization
- Secure user registration and login
- JWT-based authentication system
- Password encryption using BCrypt
- Role-based access control

---

## User Roles

### Candidate
- Create account
- Browse jobs
- Apply for jobs
- Manage profile

### Employer
- Post jobs
- Manage job listings
- View applicants

### Admin
- Manage users
- Monitor platform activities
- Manage roles and permissions

---

# Current Backend Features

- User Entity Management
- Role Entity Management
- Many-to-Many Role Mapping
- Authentication APIs
- JWT Token Generation
- Spring Security Configuration
- Job CRUD APIs
- MySQL Database Integration
- RESTful API Architecture

---

# Planned AI Features

## AI Resume Analyzer
Analyze resumes and identify:
- skills
- missing technologies
- profile strengths

---

## AI Job Recommendation System
Recommend jobs based on:
- skills
- experience
- interests
- previous applications

---

## AI Interview Preparation
Generate:
- HR interview questions
- technical questions
- skill-based assessments

---

# Project Architecture
                +----------------------+
                |      Frontend        |
                | React + Tailwind CSS |
                +----------+-----------+
                           |
                           |
                           v
                +----------------------+
                |   REST API Layer     |
                | Spring Boot Backend  |
                +----------+-----------+
                           |
        -----------------------------------------
        |                    |                  |
        v                    v                  v

+---------------+   +----------------+   +----------------+
| Authentication|   | Business Logic |   | AI Services    |
| Spring Security|  | Service Layer  |   | Spring AI      |
| JWT           |   | Job Management |   | Recommendations|
+-------+-------+   +--------+-------+   +--------+-------+
        |                       |                   |
        ---------------------------------------------
                               |
                               v
                    +-------------------+
                    |   Hibernate JPA   |
                    | ORM Mapping Layer |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |      MySQL DB     |
                    +-------------------+
# Database Design

## Users Table
Stores:

- user information
- email
- encrypted password

---

## Roles Table
Stores:

- ADMIN
- EMPLOYER
- CANDIDATE

---

## Users_Roles Table
Implements:

- Many-to-Many relationship
- Role-based authorization

---

## Jobs Table
Stores:

- job title
- company
- location
- salary
- description

---

# API Endpoints

## Authentication APIs

### Register User

```http
POST /auth/register
## Job APIs

### Create Job

```http
POST /jobs
### Get All Jobs

```http
GET /jobs
```

---

# Security Features

- JWT Token Authentication
- BCrypt Password Encryption
- Spring Security Integration
- Protected API Endpoints
- Role-Based Authorization

---

# Current Project Status

## Completed

- Backend setup
- Entity relationships
- JWT authentication
- Security configuration
- Database integration
- Initial REST APIs

---

## In Progress

- Frontend development
- AI feature integration
- Resume upload system
- Job application workflow
- Dashboard implementation

---

# Future Enhancements

- Resume Upload System
- AI Resume Screening
- Email Notifications
- Google OAuth Login
- Docker Deployment
- Cloud Deployment
- Redis Caching
- Advanced Search Filters
- Real-Time Notifications

---

# How To Run The Project

## Clone Repository

```bash
git clone  https://github.com/Anindita1606/IntelliHire-AI-Powered-Recruitment-Platform.git
```

---

## Configure MySQL

Create database:

```sql
CREATE DATABASE job_portal_db;
```

---

## Update application.properties

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

## Run Application

Run:

```text
JobPortalApplication.java
```

Server starts at:

```text
http://localhost:1004
```

---

# Testing APIs

Use:

- Postman

Example:

## Register API

```http
POST /auth/register
```

## Login API

```http
POST /auth/login
```

---

# Learning Outcomes

This project helped in understanding:

- Spring Boot backend development
- REST API design
- JWT authentication
- Spring Security
- Hibernate ORM
- Role-based authorization
- Database relationships
- Enterprise backend architecture

---

# Author

Anindita Chatterjee

---

# License

This project is developed for educational and learning purposes.
