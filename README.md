# 📌 Task Manager — Team Collaboration App

A modern task management web application designed for team collaboration. Built with a robust MERN stack, it allows users to create, assign, track, and update tasks across a team, with flexible filters and drag-and-drop support for real-time workflow updates.

---

## 🚀 Features

- 🧾 **Task Lifecycle Management** (Create, assign, update, delete)
- 🧑‍🤝‍🧑 **Roles**: Tasks can be assigned to multiple **Assignees** and created by a **Reporter**
- 🎯 **Status Tracking**: Todo, In Progress, Done
- 🏷 **Priority Levels**: Low, Medium, High (custom color-coded)
- 📆 **Due Date Management** with deadline warnings
- 🧮 **Dynamic Dashboard** with Pie & Bar charts
- 📋 **Kanban Board** with **drag-and-drop** status updates
- 🛡️ **Role-based Restrictions**: Only Assignee or Reporter can update a task
- 🔍 **Advanced Filtering** (Status, Priority, Date, etc.)
- 🧪 **Zod-based Input Validation**
- ⚛️ **Redux Toolkit** for global state management
- 🌐 **Fully Responsive UI**

---

## 🛠️ Tech Stack

| Category       | Tech                         |
|----------------|------------------------------|
| Frontend       | React (Vite), TailwindCSS, DaisyUI |
| State          | Redux Toolkit                |
| Validation     | Zod                          |
| Backend        | Node.js, Express             |
| Database       | MongoDB with Mongoose        |
| Charts         | Recharts                     |
| Drag & Drop    | react-beautiful-dnd          |
| Auth           | JWT + Cookies                |

---

## 📂 Folder Structure

```
/frontend
  ├── components/
  ├── pages/
  ├── redux/
  ├── utils/
  └── App.jsx, main.jsx

/backend
  ├── controllers/
  ├── models/
  ├── routes/
  ├── middleware/
  └── server.js
```

---

## ⚙️ Local Setup

### Prerequisites:
- Node.js and npm
- MongoDB local/Atlas setup

### Steps:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/task-manager.git
cd task-manager

# 2. Frontend setup
cd frontend
npm install
# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
npm run dev

# 3. Backend setup
cd ../backend
npm install
# Create .env file
echo "PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key" > .env
npm run dev
```

---

## 📊 Dashboard Insights

- Task distribution shown via **Pie Chart**
- Task priority levels shown via **Bar Chart**
- Real-time updates on status change
- Sorting and filtering support

---

## 🗃 Roles & Permissions

| Role        | Can Create | Can Edit | Can Change Status |
|-------------|------------|----------|-------------------|
| Reporter    | ✅         | ✅       | ✅                |
| Assignee    | ❌         | ✅       | ✅                |
| Others      | ❌         | ❌       | ❌                |

---

## 🖱 Drag & Drop Rules

- Only **Reporter** or **Assignee** can drag a task to update status
- Unauthorized drag will trigger a warning popup
- Supports dynamic sorting by priority

---

## 📈 Filtering & Sorting

- ✅ By status (Todo / In Progress / Done)
- ✅ By priority (Low / Medium / High)
- ✅ By due date
- ✅ By assignee or reporter
- ✅ Sort by priority (toggle)

---

## 🔐 Authentication

- JWT-based authentication stored via cookies
- Session persists between page reloads

---

## 🌍 Deployment Suggestions

| Layer       | Recommended Platform  |
|-------------|------------------------|
| Frontend    | Vercel / Netlify       |
| Backend     | Render / Railway / VPS |
| Database    | MongoDB Atlas          |

---

## 👨‍💻 Built With

- React + Tailwind + DaisyUI
- Redux Toolkit for state
- Zod for validation
- Express + MongoDB (Mongoose)
- react-beautiful-dnd
- Recharts for analytics

---

## 📬 Author

Built with ❤️ by [Your Name](https://github.com/your-username)

Feel free to contribute by opening issues or submitting PRs!
