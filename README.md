# Component Design Project Setup

This guide provides instructions to set up both the **backend** and **frontend** for this project.

---

## 📌 Prerequisites

- **Node.js** installed (Check with `node -v`)
- **npm** installed (Check with `npm -v`)

---

## 🚀 Root Setup (Running Both Backend & Frontend Together)

Navigate to the root folder of the project and install dependencies for both backend and frontend:

```sh
cd /path/to/your/project
npm install
```

Run both the backend and frontend in parallel:

```sh
npm run start
```

---

## 🚀 Running Backend & Frontend Separately

If you want to run them separately after installing on the root, follow these steps:

### **Backend**

#### **1️⃣ Navigate to the Backend Folder**

```sh
cd /path/to/your/project/backend
```

#### **2️⃣ Environment Configuration**

Create a `.env` file in the `backend` directory and configure your environment variables as needed.

#### **3️⃣ Running the Backend**

**Development Mode:**

```sh
npm run dev
```

**Production Mode:**

```sh
npm start
```

---

### **Frontend**

#### **1️⃣ Navigate to the Frontend Folder**

```sh
cd /path/to/your/project/client
```

#### **2️⃣ Running the Frontend**

**Development Mode:**

```sh
npm run dev
```

**Build for Production:**

```sh
npm run build
```

**Preview Production Build:**

```sh
npm run preview
```

---

## 🎯 Summary of Commands

```sh
# Install dependencies for both backend and frontend from root
cd /path/to/your/project
npm install
npm run start  # Runs both backend and frontend


# If you want to run backend and frontend separately:

# Navigate to backend and run separately
cd backend
npm run dev  # or npm start for production

# Navigate to frontend and run separately
cd ../client
npm run dev  # or npm run build for production
```

---

Now both the **backend** and **frontend** are ready! 🚀 Happy coding! 😊
