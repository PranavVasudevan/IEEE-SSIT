# IEEE SSIT · SSN Student Branch Chapter Portal & Admin CMS

A high-performance React 19 + TypeScript web application, FastAPI REST backend, and Content Management System (CMS) for the **IEEE Society on Social Implications of Technology (SSIT), SSN College of Engineering Student Branch Chapter**.

---

## 🏛 System Architecture

The project strictly follows a decoupled, three-tier architecture:

```
                            +-----------------------------+
                            |     Firebase Google Auth    |
                            | (Google OAuth Sign-In ONLY) |
                            +--------------+--------------+
                                           |
                               ID Token    |
                                           v
+------------------------------------------+------------------------------------------+
|                                     React Frontend                                  |
|        - Public Pages (Home, About, Activities, Gallery, Contact, Membership)       |
|        - Admin CMS Dashboard (/admin/dashboard)                                     |
|        - Centralized REST Client (src/api/)                                         |
+------------------------------------------+------------------------------------------+
                                           |
                             REST Requests | Authorization: Bearer <ID_TOKEN>
                                           v
+------------------------------------------+------------------------------------------+
|                                 FastAPI Backend (:8000)                             |
|        - Core Security (@ssn.edu.in Domain & Server-side Allowlist Auth)            |
|        - Routers: Team, Events, Gallery, Announcements, Settings, Admins, Storage   |
|        - Storage Service: SupabaseStorageProvider                                   |
|        - ORM: SQLAlchemy + Alembic Migrations                                       |
+-------------------------+-----------------------------------+-----------------------+
                          |                                   |
         SQLAlchemy Engine| Port 6543 (Transaction Pooler)    | Supabase REST Storage API
                          v                                   v
+-------------------------+-------------+   +-----------------+-----------------------+
|          PostgreSQL Database          |   |          Supabase Storage Bucket        |
|          (Supabase Engine)            |   |            `ieee-ssit-assets`           |
|                                       |   |                                         |
|  - team_members (11 Official Members) |   |  - team/        (Profile Photos)        |
|  - events       (Chapter Events)      |   |  - gallery/     (Event Highlights)      |
|  - gallery_photos                     |   |  - events/      (Cover Posters)         |
|  - announcements                      |   |  - branding/    (Logos & Emblems)       |
|  - contact_inquiries                  |   |  - applications/(Intake Submissions)    |
|  - membership_applications            |   +-----------------------------------------+
|  - chapter_settings                   |
|  - admin_users                        |
|  - activity_logs (Audit Trail)        |
+---------------------------------------+
```

### Core Architecture Rules:
1. **Firebase is strictly for Authentication**: Used only for client-side Google sign-in and token issuance. No application data is stored in Firestore.
2. **PostgreSQL is the single source of truth**: Managed by FastAPI via SQLAlchemy and Alembic.
3. **Supabase Storage is abstracted**: The browser never directly uploads to Supabase or uses service-role keys. Uploads flow: `React -> FastAPI -> Supabase Storage -> PostgreSQL`.

---

## 🐳 Docker Setup & One-Command Execution (Recommended)

Docker eliminates the need to manually install Python, configure virtual environments, or manage background daemons.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS / Linux) installed and running.

### 2. Environment Configuration
Create your backend environment file by copying the template:
```bash
cp backend/.env.example backend/.env
```
Ensure `backend/.env` contains your Supabase credentials:
```env
SUPABASE_DATABASE_URL=postgresql://postgres.qxagvmkczvhupkrhyyaj:ieee-ssit-ssn-2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://qxagvmkczvhupkrhyyaj.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_BUCKET=ieee-ssit-assets
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000
```

*(Optional)* Create frontend `.env` if using live Firebase Google Auth:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start the Complete Application
Run the following command in the project root directory:
```bash
docker compose up --build
```

### 4. Application URLs
| Service | URL | Description |
|---|---|---|
| **React Frontend** | [http://localhost:3000](http://localhost:3000) | Public Website & Admin CMS |
| **FastAPI Backend** | [http://localhost:8000](http://localhost:8000) | REST API Server |
| **Interactive Swagger UI** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive API documentation |
| **OpenAPI Specification** | [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json) | OpenAPI JSON schema |
| **Health Check** | [http://localhost:8000/health](http://localhost:8000/health) | Container & Service health |
| **Database Health** | [http://localhost:8000/health/db](http://localhost:8000/health/db) | PostgreSQL connectivity test |

### 5. Useful Docker Commands
```bash
# Run containers in the background (detached mode)
docker compose up -d

# View real-time logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Stop all running containers
docker compose down

# Rebuild containers from scratch (after dependency changes)
docker compose up --build -d

# Development mode with hot-reloading (mounts local backend folder)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

---

## 💻 Local Manual Setup (Without Docker)

If you prefer running the services directly on your host machine:

### Backend Setup (FastAPI):
```bash
cd backend
python -m venv .venv

# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup (React + Vite):
```bash
# In the project root:
npm install
npm run dev
```

---

## 👥 Approved 2026 Admin & Web Development Team

The following official SSN accounts are configured with administrator authorization:

### Office Bearers:
1. **Varun Sudheer** (`varun2410158@ssn.edu.in`) — Chair (BME III Year)
2. **Mohammed Afzal** — Vice-Chair (EEE III Year)
3. **Yuva Sriam** — Secretary (BME III Year)
4. **Shriram S Syam** (`shriram2410046@ssn.edu.in`) — Joint-Sec (EEE III Year)
5. **Smrithi S** — Treasurer (BME III Year)

### Web Development Team:
6. **Nathaniel Christian** (`nathaniel2470009@ssn.edu.in`) — Head (M.Tech CSE III Year)
7. **Pranav Vasudevan** (`pranav2410328@ssn.edu.in`) — Head (IT III Year)
8. **Sharruk S** (`sharruk2470048@ssn.edu.in`) — Member (M.Tech CSE III Year)
9. **Vedika Chandra** (`vedika2410432@ssn.edu.in`) — Member (CSE III Year)
10. **Harshini PS** (`harshini2410197@ssn.edu.in`) — Member (CSE III Year)
11. **Harshika Sipani** (`harshika2410326@ssn.edu.in`) — Member (CSE III Year)

- Official Chapter Email: `ieeessitsb@ssn.edu.in`

---

## 🔒 Security Best Practices
- **No Secrets in Git**: `backend/.env` is strictly ignored by `.gitignore`. `backend/.env.example` contains only placeholder values.
- **Server-Side Token Verification**: All mutations (`POST`, `PUT`, `DELETE`) require a valid Firebase ID Token and enforce `@ssn.edu.in` domain and allowlist checks server-side.
- **Audit Trails**: All admin actions are permanently recorded in the PostgreSQL `activity_logs` table.

---

## 🛠 Troubleshooting Common Docker Issues

1. **Port Already in Use (`bind: address already in use`)**:
   - Check if a local process is occupying port `8000` or `3000`:
     ```powershell
     netstat -ano | findstr :8000
     netstat -ano | findstr :3000
     ```
   - Terminate the conflicting process or change the published host port in `docker-compose.yml`.

2. **Database Connection Timeout**:
   - Ensure your internet connection can reach `aws-0-ap-south-1.pooler.supabase.com:6543`.
   - Verify `SUPABASE_DATABASE_URL` in `backend/.env`.

3. **Rebuilding Stale Caches**:
   - If frontend changes or new pip dependencies aren't reflecting, force a clean rebuild:
     ```bash
     docker compose build --no-cache
     docker compose up -d
     ```
