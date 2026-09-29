# IntelliHire backend

Spring Boot REST API for the IntelliHire job portal. The current demo scope connects candidate registration/login and applications with employer job management and applicant review.

## Requirements

- Java 17
- MySQL, with a local database named `job_portal_db`
- Maven (or the included Maven wrapper)
- The IntelliHire frontend running on `http://localhost:3000`

Check the local datasource settings in `src/main/resources/application.properties` before running. Keep database passwords out of Git. The application listens on port `1004`; CORS is configured for the frontend's local origin.

For stable JWTs across backend restarts, set `INTELLIHIRE_JWT_SECRET` to a private value containing at least 32 UTF-8 bytes in the environment used to start Spring Boot. If it is not set, the backend generates a temporary development key at startup, so users must sign in again after a restart. Never commit a real signing key.

## Start locally

1. Start MySQL and create the `job_portal_db` database.
2. Confirm the local database settings in `application.properties`.
3. Start `JobPortalProjectApplication` from STS, or run `mvn spring-boot:run` in this directory.
4. In a second terminal, go to the IntelliHire frontend folder and run `npm install` once, then `npm run dev`.
5. Open `http://localhost:3000`, register an employer account, post a job, then register a candidate account and apply with a PDF resume.

The JPA setting currently uses `ddl-auto=update` for local development. Back up the database before changing entity mappings, and use versioned migrations before deploying this project beyond a demo.

## Connected workflows

- Public visitors can list jobs and view job details.
- Candidates register or sign in, submit one application per job with a PDF resume, and view their application status.
- Employers register or sign in, create and list their own jobs, review applicants for jobs they own, download resumes, and update application status (`APPLIED`, `SHORTLISTED`, `REJECTED`, or `HIRED`).
- The backend derives ownership from the authenticated account. The frontend role guards are for navigation and user experience; the backend enforces authorization on every protected API request.
- Passwords are hashed with BCrypt. Protected requests use stateless bearer JWT authentication. Resume files are stored locally under `uploads/resumes/`, excluded from Git, and downloaded only by the employer who owns the related job.

## Main API routes

| Method | Route | Access |
| --- | --- | --- |
| `POST` | `/auth/register` | Public; accepts candidate or employer registration |
| `POST` | `/auth/login` | Public; returns a bearer token |
| `GET` | `/auth/me` | Signed in |
| `GET` | `/jobs`, `/jobs/{id}` | Public |
| `POST` | `/jobs` | Employer |
| `GET` | `/recruiter/jobs` | Employer; own jobs |
| `POST` | `/applications/{jobId}` | Candidate; multipart form with PDF resume |
| `GET` | `/applications/my` | Candidate; own applications |
| `GET` | `/recruiter/applications/job/{jobId}` | Employer; only for own jobs |
| `PUT` | `/recruiter/applications/{applicationId}/status?status=SHORTLISTED` | Employer; only for own jobs |
| `GET` | `/recruiter/applications/{applicationId}/resume` | Employer; only for own jobs |

## Current demo limits

- Job salary is a numeric annual amount displayed as INR by the frontend; there is no multi-currency model yet.
- Resume storage is local disk, not cloud storage. Back up the `uploads/resumes/` folder if you need to retain uploaded files.
- AI resume matching, admin analytics, email notifications, production deployment, and database migrations are outside the connected demo flow. Do not describe them as implemented in an interview.
- The existing Spring `contextLoads` test starts the full application and can connect to the configured local database. Run it only when that database is available and safe for schema update; compile checks alone do not validate live MySQL integration.
