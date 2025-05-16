# Software Testing Laboratory 4

This guide provides instructions to set up both the **backend** and **frontend** for this project.

---

## 📌 Prerequisites

- **Node.js** installed (Check with `node -v`)
- **npm** installed (Check with `npm -v`)

---

## 🚀 Root Setup (Running Both Backend & Frontend Together)

Install the initial packages in the root:

```sh
npm install
```

Navigate to the root folder of the project and install dependencies for both backend and frontend:

```sh
npm install-all
```

Run both the backend and frontend in parallel:

```sh
npm run start
```

Add a .env file in the client folder and add this

```sh
VITE_SERVER_URL=http://localhost:3000
```

---

## 🚀 Running Backend & Frontend Separately

If you want to run them separately after installing on the root, follow these steps:

### **Backend**

#### ** Navigate to the Backend Folder**

```sh
cd backend
```

#### ** Running the Backend**

**Development Mode:**

```sh
npm run dev
```

---

### **Frontend**

#### ** Navigate to the Frontend Folder**

```sh
cd client
```

#### ** Running the Frontend**

**Development Mode:**

```sh
npm run dev
```

## Run Cypress Test concurrently with the frontend and backend

## Run this command from the project's root

```sh
npm run test:cypress
```

## 🎯 Summary of Commands

```sh
# Install dependencies for both backend and frontend from root
npm install
npm run start  # Runs both backend and frontend


# If you want to run backend and frontend separately:

# Navigate to backend and run separately
cd backend
npm run dev  # or npm start for production

# Navigate to frontend and run separately
cd client
npm run dev  # or npm run build for production
```

---
