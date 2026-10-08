# Prime Innovation Network — Technical Documentation

**Version:** 1.0  
**Last updated:** July 2026  
**Products:** Prime Innovation Network (corporate site) · Prime Digital Academy (learning portal)

---

## 1. Overview

This repository is a full-stack learning platform:

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React 19 + TypeScript + Vite + React Router | Brand site + student/instructor UI |
| Backend | ASP.NET Core (`net10.0`) Web API | Business logic, auth, persistence |
| Database | SQLite (EF Core) | Local/dev persistence (`primeinnovation.db`) |
| Docs | Swagger / OpenAPI (Swashbuckle) | Interactive API documentation |

The frontend consumes the REST API at `VITE_API_URL` (default `http://localhost:5080/api`).

---

## 2. Repository structure

```
lanre/
├── src/                          # React frontend
│   ├── api/                      # HTTP client + AuthContext
│   ├── components/               # Layout, Navbar, Footer, CourseCard
│   ├── pages/                    # Route-level screens
│   ├── styles/global.css         # Brand design system
│   ├── App.tsx                   # Router
│   └── main.tsx                  # Bootstrap + AuthProvider
├── public/logo.png               # Brand logo
├── backend/
│   ├── NuGet.Config              # Forces nuget.org (avoids private feed auth issues)
│   ├── README.md
│   └── PrimeInnovation.Api/
│       ├── Controllers/          # REST endpoints
│       ├── Data/                 # DbContext + seeder
│       ├── DTOs/                 # Request/response contracts
│       ├── Models/               # EF entities
│       ├── Services/             # JWT token service
│       ├── Program.cs            # DI, auth, Swagger, CORS
│       └── appsettings.json
├── .env                          # VITE_API_URL
└── README.md
```

---

## 3. Architecture

```
┌─────────────────────┐         HTTPS/JSON          ┌──────────────────────────┐
│  React SPA (Vite)   │ ──────────────────────────► │  ASP.NET Core Web API    │
│  localhost:5173     │  Authorization: Bearer JWT  │  localhost:5080          │
│                     │ ◄────────────────────────── │  /swagger                │
└─────────────────────┘                             └────────────┬─────────────┘
                                                                 │
                                                                 ▼
                                                        ┌─────────────────┐
                                                        │ SQLite          │
                                                        │ primeinnovation │
                                                        │ .db             │
                                                        └─────────────────┘
```

### Request flow (authenticated)

1. User signs in via `POST /api/auth/login`.
2. API returns a JWT; frontend stores it in `localStorage` (`pin_auth`).
3. `api()` in `src/api/client.ts` attaches `Authorization: Bearer <token>` on protected calls.
4. API validates JWT (issuer, audience, lifetime, signing key) and enforces `[Authorize]` / roles.

---

## 4. Getting started

### Prerequisites

- Node.js 18+
- .NET SDK 10 (`dotnet --version`)
- Modern browser

### Backend

```bash
cd backend/PrimeInnovation.Api
dotnet restore --configfile NuGet.Config
dotnet run --launch-profile http
```

| Resource | URL |
|----------|-----|
| API base | http://localhost:5080 |
| Swagger UI | http://localhost:5080/swagger |
| OpenAPI JSON | http://localhost:5080/swagger/v1/swagger.json |

On startup, EF Core creates the SQLite database (if missing) and seeds courses, users, FAQs, blog posts, and testimonials.

### Frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173.

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5080/api` | Frontend API base URL |

Backend settings live in `appsettings.json`:

| Key | Description |
|-----|-------------|
| `ConnectionStrings:Default` | SQLite connection string |
| `Jwt:Key` / `Issuer` / `Audience` / `ExpiryHours` | JWT configuration |
| `Paystack:SecretKey` / `PublicKey` | Paystack API keys (use `sk_test_` / `pk_test_` for test mode) |
| `Email:*` | SMTP settings (`Enabled: true` to send mail) |
| `Termii:ApiKey` / `SenderId` | Nigerian SMS via [Termii](https://termii.com) (`api.ng.termii.com`) |
| `FrontendUrl` | Used in payment callback URLs |
| `Cors:Origins` | Allowed browser origins |

> **Production:** Change `Jwt:Key`, use a managed database, and configure real Paystack, SMTP, and Termii secrets.

---

## 5. Brand & UI system

| Token | Value | Usage |
|-------|-------|--------|
| Primary | `#0B3C8A` | Headers, navbar, footer |
| Secondary | `#1FB6D9` | Buttons, links, hover |
| Gold | `#F4B400` | Highlights / CTAs |
| Background | `#FFFFFF` / surface `#F4F8FC` | Page backgrounds |
| Fonts | Sora (display), Manrope (body) | Typography |

CSS variables are defined in `src/styles/global.css`.

---

## 6. Authentication & authorization

### Mechanism

- **Algorithm:** HS256 JWT
- **Password hashing:** BCrypt (`BCrypt.Net-Next`)
- **Header:** `Authorization: Bearer <token>`
- **Swagger:** Click **Authorize**, enter `Bearer <token>` (or just the token depending on UI; scheme is HTTP bearer)

### Roles (`UserRole`)

| Role | Capabilities |
|------|----------------|
| `Student` | Enroll, learn, dashboard, certificates |
| `Instructor` | Instructor panel: stats, students, create courses |
| `Admin` | Same instructor endpoints (role allowed) |

### Auth endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | No | Create account (`Student` or `Instructor` via `role`) |
| `POST` | `/api/auth/login` | No | Email/password → JWT |
| `POST` | `/api/auth/google` | No | Demo Google sign-in (creates/links user by email/`googleId`) |
| `POST` | `/api/auth/forgot-password` | No | Issues reset token (returned in response for demo) |
| `POST` | `/api/auth/reset-password` | No | Reset with email + token + new password |
| `GET` | `/api/auth/me` | Yes | Current user profile |

### Seeded demo accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `alex@example.com` | `Student@123` |
| Instructor | `ada@primedigitalacademy.com` | `Instructor@123` |
| Admin | `admin@primeinnovation.network` | `Admin@12345` |

### Example login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "Student@123"
}
```

```json
{
  "token": "eyJ...",
  "expiresAt": "2026-07-11T19:18:10Z",
  "userId": "...",
  "fullName": "Alex Johnson",
  "email": "alex@example.com",
  "role": "Student"
}
```

---

## 7. Domain model

### Core entities

| Entity | Purpose |
|--------|---------|
| `User` | Account, role, password hash, optional Google ID, reset token |
| `Course` | Catalog item (slug, price, level, category, instructor metadata) |
| `CourseModule` / `Lesson` | Curriculum hierarchy |
| `CourseMaterial` | Downloadable files |
| `Assignment` / `AssignmentSubmission` | Coursework |
| `QuizQuestion` | Multiple-choice quiz (correct index stored server-side) |
| `Enrollment` | User ↔ course, progress %, payment metadata |
| `LessonProgress` | Per-lesson completion |
| `LessonNote` | Student notes |
| `Certificate` | Issued completion certificate + verification ID |
| `BlogPost` / `FaqItem` / `Testimonial` / `ContactMessage` | Content & CRM |

### Course categories

- AI & Machine Learning  
- Data Analysis  
- Web Development  
- UI/UX  
- Generative AI  
- Data Science  
- AI Automation  

### Levels

`Beginner` · `Intermediate` · `Advanced`

### Pricing

- `Price = null` or `0` → treated as **Free** in API responses (`"Free"` string).
- Otherwise numeric NGN amount (e.g. `45000`).

---

## 8. API reference

Base URL: `http://localhost:5080/api`  
Interactive docs: Swagger UI.

Unless noted, JSON uses **camelCase**.

### 8.1 Content (public)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/content/home` | Featured courses, categories, testimonials |
| `GET` | `/content/testimonials` | Testimonials list |
| `GET` | `/content/blog` | Blog posts |
| `GET` | `/content/blog/{slug}` | Single post |
| `GET` | `/content/faqs` | FAQ list |
| `POST` | `/content/contact` | Submit contact form |

**Contact body**

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "topic": "Partnership / NGO",
  "message": "We would like to collaborate."
}
```

### 8.2 Courses (public)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/courses` | List courses; query: `level`, `category`, `featured` |
| `GET` | `/courses/categories` | Category strings |
| `GET` | `/courses/{slug}` | Full detail: curriculum, materials, assignments, quiz (options only) |

### 8.3 Enrollments (JWT)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/enrollments/courses/{slug}` | Enroll (free or after payment reference) |
| `GET` | `/enrollments/mine` | Current user’s enrollments |
| `GET` | `/enrollments/courses/{slug}` | Enrollment + course payload for learning UI |

**Enroll body**

```json
{
  "paymentProvider": "Free",
  "paymentReference": null
}
```

Paid courses require a successful payment confirmation (or a `paymentReference` on enroll).

### 8.4 Payments (JWT) — Paystack

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/payments/paystack/config` | Public: whether Paystack is configured (+ public key) |
| `POST` | `/payments/initialize/{slug}` | Creates a Paystack transaction; returns `authorizationUrl` |
| `POST` | `/payments/confirm/{slug}` | Verifies reference with Paystack, then enrolls the user |

**Flow**

1. Frontend calls initialize with `provider: "Paystack"` and a callback URL.
2. User is redirected to Paystack Checkout (`authorizationUrl`).
3. Paystack redirects back to the callback with `reference` / `trxref`.
4. Frontend calls confirm; API verifies via `GET /transaction/verify/{reference}` before enrollment.

**Initialize body**

```json
{
  "provider": "Paystack",
  "callbackUrl": "http://localhost:5173/courses/data-analysis-with-python?provider=paystack"
}
```

Configure keys in `appsettings.json`:

```json
"Paystack": {
  "SecretKey": "sk_test_...",
  "PublicKey": "pk_test_...",
  "BaseUrl": "https://api.paystack.co"
}
```

Or environment variables: `Paystack__SecretKey`, `Paystack__PublicKey`.

### 8.5 Learning portal (JWT)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/learn/{slug}/progress` | Mark lesson complete; recalculates `%`; may auto-issue certificate at 100% |
| `GET` | `/learn/{slug}/notes` | List notes |
| `POST` | `/learn/{slug}/notes` | Create/update note |
| `POST` | `/learn/{slug}/assignments/{assignmentId}` | Submit assignment |
| `POST` | `/learn/{slug}/quiz` | Grade quiz answer |

**Progress body**

```json
{ "lessonId": "<guid>", "completed": true }
```

**Quiz body**

```json
{ "questionId": "<guid>", "selectedOptionIndex": 0 }
```

### 8.6 Dashboard (JWT)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/dashboard` | Stats + enrolled courses |
| `PUT` | `/dashboard/profile` | Update full name / email |

### 8.7 Certificates

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/certificates/mine` | Yes | User’s certificates |
| `POST` | `/certificates/generate/{slug}` | Yes | Issue cert if course completed |
| `GET` | `/certificates/verify/{certificateId}` | No | Public verification |

Certificate IDs follow: `PIN-PDA-{YEAR}-{SEQ}` (e.g. `PIN-PDA-2026-00001`).  
Brand name on certificates: **Prime Innovation Network** / Academy: **Prime Digital Academy**.

### 8.8 Instructor panel (JWT + role `Instructor` or `Admin`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/instructor/stats` | Published courses, students, avg completion |
| `GET` | `/instructor/students` | Roster (`?courseSlug=` optional filter) |
| `GET` | `/instructor/courses` | Instructor’s courses with full detail |
| `POST` | `/instructor/courses` | Create/publish a course with curriculum |
| `PUT` | `/instructor/courses/{slug}` | Update course metadata |
| `DELETE` | `/instructor/courses/{slug}` | Delete course and related data |
| `POST` | `/instructor/courses/{slug}/modules` | Add module (+ optional lessons) |
| `POST` | `/instructor/courses/{slug}/modules/{moduleId}/lessons` | Add lesson |
| `DELETE` | `/instructor/courses/{slug}/modules/{moduleId}` | Remove module |
| `POST` | `/instructor/courses/{slug}/assignments` | Add assignment |
| `POST` | `/instructor/courses/{slug}/quiz` | Add quiz question |
| `POST` | `/instructor/courses/{slug}/materials` | Add material by URL |
| `POST` | `/instructor/courses/{slug}/upload` | Multipart file upload (`file`, `kind=material\|preview`) |

Uploaded files are served from `/uploads/{courseSlug}/...` via static files.

---

## 9. Frontend routes & data binding

| Route | Page | API usage |
|-------|------|-----------|
| `/` | Home | `GET /content/home` |
| `/courses` | Catalog + filters | `GET /courses`, `GET /courses/categories` |
| `/courses/:slug` | Detail + enroll/pay | `GET /courses/{slug}`, payments/enrollments |
| `/learn/:slug` | Learning portal | enrollments + learn endpoints |
| `/dashboard` | Student hub | `GET /dashboard`, `PUT /dashboard/profile` |
| `/certificate` | Certificates | certificates endpoints |
| `/login` · `/signup` | Auth | auth endpoints |
| `/instructor` | Instructor UI | instructor endpoints |
| `/about` | Static brand page | — |
| `/blog` · `/faq` · `/contact` | Content | content endpoints |

### Client helpers

- `src/api/client.ts` — `api<T>()`, token storage, `ApiError`
- `src/api/AuthContext.tsx` — `login`, `register`, `googleSignIn`, `logout`

---

## 10. Typical user journeys

### Free course

1. Register/login  
2. `POST /enrollments/courses/ai-fundamentals` with `paymentProvider: "Free"`  
3. Open `/learn/ai-fundamentals`  
4. Complete lessons → progress updates  
5. At 100%, certificate may auto-generate; or call `POST /certificates/generate/{slug}`

### Paid course (demo)

1. Login  
2. `POST /payments/initialize/{slug}` with `Paystack` or `Flutterwave`  
3. `POST /payments/confirm/{slug}` with returned `reference`  
4. Continue in learning portal  

Frontend course detail page performs initialize + confirm in one demo flow for convenience.

---

## 11. Swagger usage

1. Start the API.  
2. Open http://localhost:5080/swagger.  
3. Call `POST /api/auth/login`.  
4. Copy `token`.  
5. Click **Authorize** → enter the bearer token.  
6. Call protected endpoints (enrollments, learn, dashboard, instructor).

Root `/` redirects to `/swagger`.

---

## 12. Security notes

| Topic | Current behavior | Production recommendation |
|-------|------------------|---------------------------|
| JWT key | In `appsettings.json` | Secret store / Key Vault; rotate regularly |
| Password reset | Token returned in API body | Send via email only |
| Google sign-in | Trusts client-supplied email/ID | Verify Google ID token server-side |
| Payments | Demo references | Live SDK + webhooks + signature verification |
| CORS | Local Vite origins | Restrict to production domains |
| HTTPS | HTTP in local profile | Enforce HTTPS + HSTS |
| SQLite | File DB | SQL Server / PostgreSQL for multi-instance |

---

## 13. Configuration reference

### `appsettings.json` (excerpt)

```json
{
  "ConnectionStrings": {
    "Default": "Data Source=primeinnovation.db"
  },
  "Jwt": {
    "Key": "<change-me>",
    "Issuer": "PrimeInnovation.Api",
    "Audience": "PrimeInnovation.Web",
    "ExpiryHours": 24
  },
  "Email": {
    "Enabled": true,
    "Host": "smtp.gmail.com",
    "Port": 587,
    "Username": "...",
    "Password": "...",
    "FromEmail": "noreply@primeinnovation.network",
    "AdminEmail": "hello@primeinnovation.network"
  },
  "Termii": {
    "ApiKey": "<termii-api-key>",
    "SenderId": "PrimePIN",
    "Channel": "generic",
    "BaseUrl": "https://api.ng.termii.com"
  },
  "FrontendUrl": "http://localhost:5173",
  "Cors": {
    "Origins": ["http://localhost:5173", "http://127.0.0.1:5173"]
  }
}
```

Notifications (welcome, password reset, enrollment) go out over SMTP email and Termii SMS when configured. Signup accepts a Nigerian phone (`0803…` or `234…`).

### Launch profile

`Properties/launchSettings.json` → profile `http` → `http://localhost:5080`, launches Swagger.

### NuGet

Use project/local `NuGet.Config` that clears other feeds and uses `https://api.nuget.org/v3/index.json` if a machine-level private Azure Artifacts feed causes `401` restore failures.

---

## 14. Build & deploy checklist

**Backend**

```bash
cd backend/PrimeInnovation.Api
dotnet publish -c Release -o ./publish
```

**Frontend**

```bash
npm run build
# output: dist/
```

Serve `dist/` behind any static host/CDN; point `VITE_API_URL` at the deployed API at build time.

Ensure:

- [ ] CORS origins match the deployed frontend  
- [ ] JWT secret rotated  
- [ ] Database connection configured  
- [ ] Payment provider keys configured  
- [ ] Swagger disabled or secured in production if desired  

---

## 15. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Frontend shows API error on home | API not running / wrong port | Start API on 5080; check `.env` |
| `401 Unauthorized` | Missing/expired token | Re-login; Authorize in Swagger |
| `403 Forbidden` on instructor APIs | Student role | Login as instructor demo account |
| NuGet `401` on restore | Private feed in global config | `dotnet restore --configfile NuGet.Config` |
| Empty courses | DB not seeded | Delete `primeinnovation.db` and restart API |
| CORS errors in browser | Origin not allowed | Add origin under `Cors:Origins` |

---

## 16. Related documents

- Product brief: `Prime Innovation Network Website.pdf`  
- Backend quick start: `backend/README.md`  
- Project README: `README.md`  
- Live contract: http://localhost:5080/swagger  

---

## 17. Glossary

| Term | Meaning |
|------|---------|
| **PIN** | Prime Innovation Network — corporate brand / main website |
| **PDA** | Prime Digital Academy — learning portal powered by PIN |
| **Enrollment** | Paid or free registration of a user into a course |
| **Certificate ID** | Public verification identifier for a completion certificate |
