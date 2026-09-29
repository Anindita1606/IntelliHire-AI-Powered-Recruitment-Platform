# IntelliHire — Frontend

A production-style **React + TypeScript + Vite** frontend for **IntelliHire**, an enterprise HR-tech recruitment platform. It integrates **honestly** with an existing **Java Spring Boot + JWT** backend — no mock APIs, no fabricated data.

> The backend is the source of truth. This app only calls endpoints that actually exist on the Spring Boot server. Features whose endpoints are not yet available are shown as polished **"Backend integration pending"** states.

---

## ✨ Features

- **Enterprise landing page** with the IntelliHire visual identity (Deep Indigo + Slate).
- **Light / Dark theme** toggle with system-preference detection and persistence.
- **JWT authentication** — login & register against the real backend, token stored and auto-attached to requests.
- **Protected routes** with graceful redirects and 401/403 handling.
- **Live job board** — `GET /jobs` with client-side search & location filtering, loading / empty / error states.
- **Job details** page resolved from the job list (backend has no `GET /jobs/{id}` yet).
- **Create job** — `POST /jobs` with live preview and React Query cache invalidation.
- **Candidate / Recruiter / Admin** workspace shells, clearly marked where backend APIs are pending.
- **AI features** presented as roadmap previews — no fake AI output.
- Fully **responsive**, accessible, with subtle animations.

---

## 🧱 Tech stack

| Concern            | Choice                          |
| ------------------ | ------------------------------- |
| Framework          | React 18 + TypeScript           |
| Build tool         | Vite                            |
| Routing            | React Router v6                 |
| Server state       | TanStack React Query            |
| HTTP client        | Axios (centralized instance)    |
| Styling            | Tailwind CSS                    |
| Icons              | lucide-react                    |
| Notifications      | sonner                          |

---

## 📁 Folder structure

```
src/
├── api/
│   ├── axios.ts          # Centralized Axios instance + JWT interceptors
│   ├── authApi.ts        # POST /auth/login, POST /auth/register
│   └── jobsApi.ts        # GET /jobs, POST /jobs
├── components/
│   ├── auth/             # ProtectedRoute, AuthShell
│   ├── common/           # Button, Input, Badge, StateViews, ComingSoon, ThemeToggle...
│   ├── jobs/             # JobCard, JobFilters, JobCardSkeleton
│   └── layout/           # Navbar, Footer, AppLayout, DashboardShell, Logo
├── context/
│   ├── AuthContext.tsx   # Auth state, login/logout, session persistence
│   └── ThemeContext.tsx  # Light/dark theme
├── hooks/
│   └── useJobs.ts        # React Query hooks for jobs
├── lib/
│   ├── utils.ts          # cn(), formatSalary(), getInitials()
│   └── errors.ts         # Normalizes API errors into safe messages
├── pages/
│   ├── Landing.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Jobs.tsx
│   ├── JobDetails.tsx
│   ├── CreateJob.tsx
│   ├── CandidateDashboard.tsx
│   ├── RecruiterDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── NotFound.tsx
├── types/index.ts        # User, Job, AuthResponse, Login/RegisterRequest, ApiError
├── App.tsx               # Routes
├── main.tsx              # Providers (Theme, Query, Router, Auth, Toaster)
└── index.css             # Tailwind + design tokens
```

---

## 🔧 Environment variables

Create a `.env` file (see `.env.example`):

```
VITE_API_BASE_URL=http://localhost:8080
```

- `VITE_API_BASE_URL` — base URL of your Spring Boot backend. The Axios base URL comes only from here; localhost is never hard-coded in the code.
- **Do not** put secrets in `VITE_*` variables — they are embedded into the public client bundle.

---

## 🌐 Real backend endpoints used

| Method | Endpoint         | Purpose               | Response                         |
| ------ | ---------------- | --------------------- | -------------------------------- |
| POST   | `/auth/register` | Register a new user   | `"User Registered Successfully"` |
| POST   | `/auth/login`    | Authenticate          | `{ "token": "JWT" }`             |
| GET    | `/jobs`          | List all jobs         | `Job[]`                          |
| POST   | `/jobs`          | Create a job          | `Job`                            |

`Job = { id, title, company, location, salary, description }`

The JWT is stored in `localStorage` and attached as `Authorization: Bearer <token>` on every request via an Axios interceptor. Tokens are never logged to the console.

---

## 🚧 Backend functionality still required for future features

These UI areas are built but intentionally show **"Backend integration pending"** until the endpoints exist:

- **Current user**: `GET /auth/me` (to display the authenticated user's name / role)
- **Job details / edit / delete**: `GET /jobs/{id}`, `PUT /jobs/{id}`, `DELETE /jobs/{id}`
- **Applications**: `POST /applications`, `GET /applications/me`, `GET /jobs/{id}/applicants`, `PATCH /applications/{id}/status`
- **Candidate**: `GET /candidates/me`, `GET /saved-jobs`
- **Recruiter**: `GET /recruiter/pipeline`, `GET /recruiter/analytics`
- **Admin**: `GET /admin/users`, `PATCH /admin/users/{id}/role`, `GET /admin/analytics`
- **AI (Spring AI)**: resume analysis, job recommendations, interview question generation

---

## 🚀 Local setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# edit .env and point VITE_API_BASE_URL at your running Spring Boot backend

# 3. Start the dev server
npm run dev
```

Make sure your Spring Boot backend is running (default `http://localhost:8080`) and that **CORS** allows the frontend origin.

## 🏗️ Build

```bash
npm run build     # type-checks then builds to /dist
npm run preview   # serve the production build locally
```

---

## ▲ Vercel deployment

1. Push this repository to GitHub.
2. In Vercel, **Import Project** and select the repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
4. Add an environment variable:
   - `VITE_API_BASE_URL` = your production Spring Boot API URL (e.g. `https://api.yourdomain.com`).
5. Deploy.

`vercel.json` includes a SPA rewrite so React Router deep links (e.g. `/jobs/5`) resolve correctly after refresh.

> Ensure the production backend enables CORS for your Vercel domain and is served over HTTPS.

---

## 🔒 Honesty guarantees

- No mock authentication — auth uses the real `/auth/*` endpoints.
- No fake jobs, applications, applicants, analytics, or AI responses.
- No hard-coded demonstration user (e.g. "Maya").
- No unsupported endpoint is treated as real.
```
