# Sihatek Project

A Node.js/Express-based backend application built for the Hackathon.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Understanding the Project](#understanding-the-project)
3. [Prerequisites](#prerequisites)
4. [Clone the Repository](#clone-the-repository)
5. [Installation](#installation)
6. [Running the Project](#running-the-project)
7. [Creating and Pushing a New Branch](#creating-and-pushing-a-new-branch)
8. [Project Structure](#project-structure)
9. [Available Scripts](#available-scripts)

---

## 🎯 Project Overview

**Sihatek** is a hackathon project built with:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Environment Management**: dotenv
- **Development Tool**: Nodemon (for hot-reloading)

This project provides a structured backend application with organized controllers, models, routes, and services.

---

## 🔍 Understanding the Project

### Key Components

- **Controllers**: Handle business logic and request processing
- **Models**: Define data structures and schemas
- **Routes**: Define API endpoints and HTTP mappings
- **Services**: Contain reusable business logic and external service integrations
- **Middlewares**: Handle cross-cutting concerns (authentication, logging, validation)
- **Utils**: Helper functions and utilities
- **Config**: Configuration files including environment setup

### Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Express.js** | Web framework |
| **Dotenv** | Environment variable management |
| **Nodemon** | Development auto-reload |
| **Node.js** | JavaScript runtime |

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **Text Editor/IDE** - VSCode recommended

### Verify Installation

```bash
node --version
npm --version
git --version
```

---

## 🔄 Clone the Repository

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sihatek.git
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 2: Navigate into the Project

```bash
cd sihatek
```

---

## 📦 Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install all the dependencies listed in `package.json`:
- express
- dotenv
- nodemon

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your environment variables (example):

```env
PORT=3000
NODE_ENV=development
```

---

## 🚀 Running the Project

### Development Mode (with Auto-Reload)

```bash
npm run dev
```

This runs the project using **Nodemon**, which automatically restarts the server when you make changes to files.

### Production Mode

```bash
npm start
```

This runs the project in production mode using Node.js.

### Test Build

```bash
npm test
```

## 🧩 Prisma (Windows note)

On Windows you may see an `EPERM: operation not permitted, rename ... query_engine-windows.dll.node` after running Prisma commands. This usually happens when the server (or another Node process) is currently using the Prisma Client.

- Stop the running server (`npm run dev`) and re-run the command.
- Or run migrations without generating the client: `npm run prisma:migrate:skip-generate`, then run `npm run prisma:generate`.

---

## 🌿 Creating and Pushing a New Branch

### Step 1: Create a New Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch Naming Convention**:
- `feature/` - for new features
- `bugfix/` - for bug fixes
- `hotfix/` - for critical fixes
- `docs/` - for documentation updates

Example:
```bash
git checkout -b feature/user-authentication
```

### Step 2: Make Your Changes

Edit files and make your changes as needed.

### Step 3: Stage Changes

```bash
git add .
```

Or stage specific files:
```bash
git add src/controllers/userController.js
```

### Step 4: Commit Changes

```bash
git commit -m "Add user authentication feature"
```

**Commit Message Best Practices**:
- Use clear, descriptive messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep it concise but informative

### Step 5: Push to Remote Repository

```bash
git push origin feature/your-feature-name
```

### Step 6: Create a Pull Request (PR)

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Add description of your changes
4. Request reviewers if applicable
5. Submit the PR

---

## 📁 Project Structure

```
sihatek/
├── src/
│   ├── app.js                 # Express app setup
│   ├── server.js              # Server entry point
│   ├── config/
│   │   └── env.js             # Environment configuration
│   ├── controllers/           # Request handlers
│   ├── middlewares/           # Custom middlewares
│   ├── models/                # Data models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   └── utils/                 # Helper functions
├── .env                       # Environment variables (create locally)
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
├── package-lock.json          # Locked dependency versions
└── README.md                  # Project documentation
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the project in production mode |
| `npm run dev` | Run the project in development mode with Nodemon |
| `npm test` | Run tests |

---

## 🤝 Contributing

1. Create a new branch from `main`
2. Make your changes
3. Push to your branch
4. Create a Pull Request
5. Wait for code review

---

## 📝 Notes

- **Node Modules**: Never commit `node_modules/` folder (already in `.gitignore`)
- **Environment Variables**: Never commit `.env` file (sensitive data)
- **Development**: Use `npm run dev` for active development
- **Production**: Use `npm start` after building/preparing for deployment

---

## 🆘 Troubleshooting

### Port Already in Use
If port 3000 is already in use, update your `.env` file:
```env
PORT=5000
```

### Dependencies Not Installing
Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Changes Not Reflecting in Dev Mode
Make sure you're running `npm run dev` and check that the file changes are being detected by Nodemon.

---

## 📧 Support

For questions or issues, please create an issue in the GitHub repository.

---

**Happy Coding! 🚀**
