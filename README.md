# 🚀 BNV User Management System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A premium, full-stack MERN (MongoDB, Express, React, Node.js) application built for comprehensive user management. This application features a highly interactive, animated UI with system-wide dark mode, an analytics dashboard, and robust backend APIs.

---

## ✨ Key Features

- **📊 Analytics Dashboard**: Real-time insights showing Total, Active, and Inactive users.
- **🌗 System-Wide Dark Mode**: A sleek, animated toggle for switching between Light and Dark themes instantly.
- **🎨 Premium UI/UX**: Beautiful glassmorphism styling, animated skeleton loaders, interactive hover states, and fluid page transitions.
- **👥 Full User CRUD**: Seamlessly Create, Read, Update, and Delete user profiles.
- **🖼️ Profile Image Upload**: Robust backend file handling using Multer to upload and serve user avatars.
- **🔍 Search & Pagination**: Effortlessly search through large datasets with server-side pagination.
- **📥 CSV Data Export**: One-click export of user records directly to a CSV file.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (via Vite)
- **Routing**: React Router DOM
- **Data Fetching**: Axios
- **Styling**: Vanilla CSS (Custom Design Tokens, Keyframe Animations, CSS Variables for Theming)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **File Uploads**: Multer
- **Security & Utils**: CORS, Dotenv

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd BNV
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend development server:
```bash
npm run dev
```
*The backend will run on http://localhost:5000*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will run on http://localhost:5173*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/stats` | Retrieve total, active, and inactive user statistics. |
| `GET` | `/api/users` | Get all users (supports `?page`, `?limit`, `?search`). |
| `GET` | `/api/users/:id` | Get a specific user by ID. |
| `POST` | `/api/users` | Create a new user (accepts `multipart/form-data`). |
| `PUT` | `/api/users/:id` | Update an existing user. |
| `DELETE` | `/api/users/:id` | Delete a user. |
| `PATCH`| `/api/users/:id/status`| Inline update for user status (Active/Inactive). |
| `GET` | `/api/users/export/csv` | Download users list as a CSV file. |

---

## 📂 Folder Structure

```text
BNV/
├── backend/
│   ├── src/
│   │   ├── config/      # Database connections
│   │   ├── controllers/ # API logic (users, stats, etc.)
│   │   ├── middleware/  # Error handlers, Multer config
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Express routes
│   │   └── utils/       # Helpers (CSV exporter, API response)
│   ├── uploads/         # Static folder for profile images
│   └── server.js        # Backend entry point
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios API clients
    │   ├── components/  # Reusable UI components (Modals, Toggles, etc.)
    │   ├── context/     # React Context (ThemeContext)
    │   ├── hooks/       # Custom hooks (useToast)
    │   ├── pages/       # Page components (UserList, UserForm, UserView)
    │   └── utils/       # Frontend validation logic
    ├── index.css        # Global CSS variables, Themes, and Animations
    └── App.jsx          # Root component & Routing
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is [MIT](https://opensource.org/licenses/MIT) licensed.
