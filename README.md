# Ticket Management System

## 📌 Project Overview
This is a simple **ticket management system** built with **PHP, Alpine.js, and Vite**. It allows users to **log in, add, view, and delete tickets**. The system uses **JSON** for data storage instead of a database.

## 🚀 Features
- **User Authentication** (Login & Logout)
- **Create, View, and Delete Tickets** (Only for Logged-in Users)
- **Frontend Built with Alpine.js**
- **SCSS Compilation with Vite**
- **File Watching for Auto Compilation**

---

## 🔧 Installation & Setup

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-repo/ticket-management.git
cd ticket-management
```

### **2️⃣ Install Dependencies**
Ensure you have **Node.js** installed. Then, install dependencies:
```bash
npm install
```

### **3️⃣ Start the Development Server**
```bash
npm run dev
```

### **4️⃣ Start PHP Server**
If using PHP's built-in server:
```bash
php -S localhost:8000
```
Or if using XAMPP/Apache, place files in `htdocs/` and access via your virtual host (`twa-2025.test`).

---

## 🔑 User Login Credentials
The system currently uses **hardcoded login credentials** (this can be replaced with a database in the future).

| Username | Password |
|----------|----------|
| admin    | password123 |

### **Login & Logout**
- Visit **`http://twa-2025.test/login.php`** to log in.
- Once logged in, you can **add and delete tickets**.
- Click **Logout** to end the session.

---

## 📁 Project Structure
```
/ticket-management
│── index.php          # Main entry point
│── login.php          # User login page
│── vite.config.js     # Vite configuration
│── package.json       # Project dependencies
│── dist/              # Built assets (CSS, JS)
│── src/
│   ├── css/style.scss # SCSS Styles
│   ├── js/main.js     # Alpine.js logic
│   ├── php/tickets.json # JSON-based ticket storage
```

---

## ✨ Usage
1. **Login as Admin**
2. **Add a new ticket** using the input form
3. **View all tickets** dynamically
4. **Delete tickets** (only logged-in users can do this)
5. **Logout** to secure your session

---

## 🎯 Future Improvements
- 🔄 **Database Support** (Replace JSON with MySQL)
- 🎨 **Better UI Design** (Enhance layout and styling)
- 🔐 **Role-Based Access** (Admin/User accounts)

---

## 🛠️ Technologies Used
- **PHP** (Backend logic)
- **Alpine.js** (Frontend interactivity)
- **Vite.js** (SCSS Compilation & File Watching)
- **JSON** (Data storage)
- **Tailwind CSS / Custom SCSS** (Styling)

---

## 🤝 Contributing
Feel free to fork this project and submit pull requests! 🚀

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/ticket-management.git
   ```
2. Create a feature branch:
   ```bash
   git checkout -b new-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Added new feature"
   ```
4. Push to GitHub and create a PR!

---

## 📜 License
This project is licensed under the **MIT License**.

test