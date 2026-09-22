# SkillSetu (कौशल सेतु)

**Academia–Industry Collaboration Portal for Skill Mapping, Internships and Placement**  
*Problem Statement 26044 • Ministry of Ayush • All India Institute of Ayurveda (Smart Automation Theme)*

---

## 🏛️ Project Overview
SkillSetu is a unified institutional platform connecting **Students/Scholars**, **Academicians (Faculty)**, **Industry Recruiters**, and **Institutions (Placement Cells & Deans)**. It bridges classical Ayurvedic pharmacology, clinical therapies (Panchakarma), and modern healthcare domains (GCP clinical trials, health informatics, pharmaceutical standardization) with accredited industrial career pathways.

---

## 📦 Monorepo Structure

```
.
├── client/                     # Vite + React 18+ (ES Modules, .jsx)
│   ├── src/
│   │   ├── components/ui/      # 12+ shadcn-style UI primitives (cva + tailwind-merge)
│   │   ├── components/layout/  # Navbar, Footer, AppShell, RoleSidebar, ProtectedRoute
│   │   ├── context/            # AuthContext (with mock role switcher), ToastContext
│   │   ├── mock/               # Comprehensive mock datasets (Users, Stats, Opportunities)
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, DashboardPage
│   │   └── services/           # Axios API services with JWT & mock fallback
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/                     # Express.js + Mongoose (ES Modules, .js)
│   ├── src/
│   │   ├── config/             # MongoDB connection with retry logic
│   │   ├── controllers/        # Auth, Dashboard, Opportunities
│   │   ├── middleware/         # JWT Auth, RBAC guards, rate-limiting, error handler
│   │   ├── models/             # User, Institution, Opportunity, Program, Application, Assessment
│   │   ├── routes/             # REST API endpoints
│   │   └── scripts/seed.js     # Realistic demo seeder for all 4 roles & domains
│   ├── package.json
│   ├── server.js
│   └── .env.example
│
└── README.md
```

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js v18+ or v20+
- MongoDB instance (local or MongoDB Atlas connection string)

### 1. Server Setup (Express + Mongoose)
```bash
cd server
npm install
cp .env.example .env

# Run database seeder with realistic AIIA and Ayush data
npm run seed

# Start server in development mode (runs on port 5000)
npm run dev
```

### 2. Client Setup (Vite + React)
```bash
cd client
npm install
cp .env.example .env

# Run development server (runs on port 3000)
npm run dev
```

---

## 🔑 Environment Configuration

### Client (`/client/.env.example`)
```env
# URL to backend API
VITE_API_URL=http://localhost:5000/api

# Set to true to run in standalone browser preview without requiring a live MongoDB server
VITE_USE_MOCK=true
```

### Server (`/server/.env.example`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skillsetu
JWT_SECRET=skillsetu_super_secret_jwt_key_26044_aiia
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

---

## 👥 Four Supported Roles in Phase 1

1. **Student / Ayush Scholar**:
   - Diagnostic skill tests across Dravyaguna, Panchakarma, GCP, and Informatics.
   - Matched corporate internships and clinical residencies.
   - Verifiable digital portfolio with AIIA endorsements.

2. **Academician / Faculty**:
   - Mentee tracking and clinical supervision logs.
   - Sponsored industrial sabbaticals and high-throughput lab fellowships.
   - Skill endorsement issuance and co-mentored R&D.

3. **Industry Partner / Recruiter**:
   - Direct talent search filtered by accredited laboratory competencies.
   - Job/internship postings with automatic candidate pipeline (Applied → Shortlisted → Interview).
   - Joint research labs with AIIA faculty.

4. **Institution / Placement Cell & Admin**:
   - Placement & internship percentages, median stipends, and sector distribution.
   - Corporate MoU tracking and renewal audits.
   - Automated exports for NAAC Criterion V and NCISM compliance.

---

## 🎨 Design System: "Minimalist Modern"
- **Background**: `#FAFAFA` (Zinc-50 soft canvas)
- **Foreground**: `#0F172A` (Slate-900 high contrast)
- **Primary Accent**: `#0052FF` with `#4D7CFF` gradient
- **Typography**:
  - Display: *Calistoga* (Ink-trap rounded serif)
  - Body & UI: *Plus Jakarta Sans*
  - Data / Tags / Code: *JetBrains Mono*
