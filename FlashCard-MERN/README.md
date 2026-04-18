# ⚡ FlashCard MERN — Premium Edition

> A full-stack **MERN** application for managing student flashcards with JWT auth, image uploads via Cloudinary, search, filtering, and pagination.

---

## 🏗️ Project Structure

```
FlashCard-MERN/
├── backend/
│   ├── server.js              # Entry point
│   ├── .env.example           # Environment template
│   └── src/
│       ├── config/
│       │   ├── db.js          # MongoDB Atlas connection
│       │   └── cloudinary.js  # Cloudinary + Multer setup
│       ├── models/
│       │   ├── User.js        # User schema (bcrypt hook)
│       │   └── Student.js     # Student schema (text index)
│       ├── controllers/
│       │   ├── authController.js    # register / login / getMe
│       │   └── studentController.js # CRUD + search + pagination + stats
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── studentRoutes.js
│       └── middleware/
│           ├── auth.js              # JWT protect + adminOnly
│           ├── errorMiddleware.js   # Global error handler + 404
│           └── validate.js          # express-validator rules
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── utils/api.js           # Axios instance + interceptors
        ├── context/AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── StudentCard.jsx
        │   ├── StudentModal.jsx    # Add/Edit modal
        │   └── Pagination.jsx
        └── pages/
            ├── Home.jsx           # Main flashcard grid
            ├── Login.jsx
            └── Register.jsx
```

---

## ⚙️ Setup

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Backend `.env`

```bash
cp .env.example .env
```

Fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/flashcard_db
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Configure Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

#### 🔐 Auth Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login + get token | ❌ |
| GET | `/auth/me` | Get current user | ✅ |

#### 🎓 Student Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/students` | Get all (search + filter + paginate) | ❌ |
| GET | `/students/stats` | Total, courses, cities count | ❌ |
| GET | `/students/:id` | Get single student | ❌ |
| POST | `/students` | Add student (with image) | ✅ |
| PUT | `/students/:id` | Update student | ✅ |
| DELETE | `/students/:id` | Delete student | ✅ |

#### Query Params for GET `/students`

| Param | Type | Example |
|-------|------|---------|
| `search` | string | `?search=pratham` |
| `course` | string | `?course=btech` |
| `city` | string | `?city=agra` |
| `year` | number | `?year=2` |
| `page` | number | `?page=1` |
| `limit` | number | `?limit=9` |
| `sort` | string | `?sort=-createdAt` |

---

## ✨ Premium Features

- ✅ **JWT Auth** — Register, Login, protected routes
- ✅ **bcryptjs** — Passwords hashed with salt rounds 12
- ✅ **MongoDB Atlas** — Cloud database with Mongoose ODM
- ✅ **Cloudinary** — Cloud image storage with auto face-crop
- ✅ **Search** — Real-time debounced search across name/course/city
- ✅ **Filter** — Filter by course and city
- ✅ **Pagination** — Configurable page size
- ✅ **Stats Dashboard** — Total students, unique courses, cities
- ✅ **Rate Limiting** — 100 req/15min global, 10 req/15min auth
- ✅ **Helmet** — Security headers
- ✅ **express-validator** — Input validation
- ✅ **Global error handler** — Consistent error format
- ✅ **React + Vite** — Fast frontend with hot reload
- ✅ **React Router** — Client-side routing
- ✅ **Toast notifications** — User feedback
- ✅ **Responsive UI** — Works on all screen sizes

---

## 🛡️ Auth Flow

```
1. POST /auth/register  → creates user, returns JWT
2. POST /auth/login     → verifies password, returns JWT
3. Store token in localStorage
4. Send: Authorization: Bearer <token> on protected requests
5. Token expires in 7 days
```

---

## 👨‍💻 Developer

**Pratham Raj** — Full-Stack MERN Developer

---

Made with ❤️ — FlashCard Premium Edition
