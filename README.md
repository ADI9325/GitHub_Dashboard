# GitHub OAuth App

A full-stack web application that allows users to authenticate via GitHub OAuth and view their GitHub repositories in a dashboard.

## 📌 Project Overview

This application integrates GitHub OAuth authentication to allow users to securely log in with their GitHub accounts. Once authenticated, users can access and view details of their repositories in an interactive dashboard.

## 🚀 Features

- GitHub OAuth authentication using `passport-github2`
- Secure session handling with `express-session`
- Interactive dashboard to display GitHub repositories
- Backend built with `Node.js` and `Express.js`
- Frontend built with `React.js` and `Tailwind CSS`
- API integration using `Axios`
- Data visualization using `Chart.js`

## 🛠 Tech Stack

### Frontend:

- React.js
- Material UI
- Tailwind CSS
- Axios
- Chart.js

### Backend:

- Node.js
- Express.js
- Passport.js
- Express-session
- Dotenv
- CORS

## 📂 Project Structure

```
GitHub-OAuth-App/
│── backend/               # Backend files (Node.js & Express)
│   ├── config/           # Configuration files
│   ├── controllers/      # Controllers for authentication & data
│   ├── middleware/       # Middleware for authentication
│   ├── routes/           # API routes
│   ├── .env              # Environment variables
│   ├── index.js          # Main backend entry point
│── client/                # Frontend files (React.js)
│   ├── src/              # React source code
│   ├── public/           # Public assets
│   ├── tailwind.config.js # Tailwind CSS configuration
│   ├── package.json      # Frontend dependencies
│── README.md              # Documentation
```

## 🔧 Installation & Setup

### Prerequisites:

- Node.js installed
- GitHub OAuth credentials (Client ID & Client Secret)

### 1️⃣ Clone the Repository:

```sh
git clone https://github.com/ADI9325/GitHub_Dashboard.git
cd GitHub-OAuth-App
```

### 2️⃣ Backend Setup:

```sh
cd backend
npm install
```

Create a `.env` file in the `backend` folder and add:

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret
```

Start the backend server:

```sh
node index.js
```

### 3️⃣ Frontend Setup:

```sh
cd client
npm install
npm start
```

## 📺 Demo

[Watch Video Demo](https://drive.google.com/file/d/1lZWA4Vf9n8l1jqafzcQ1XfTT-erae7Sg/view?usp=sharing)

## 🎯 Usage

1. Visit the frontend at `http://localhost:3000`
2. Click the "Login with GitHub" button
3. Authenticate with GitHub
4. View your repositories in the dashboard

## 📝 License

This project is licensed under the MIT License.

---

### ✨ Contributors

- **Aditya Bagade** - _Developer_

Feel free to modify this README as needed!
