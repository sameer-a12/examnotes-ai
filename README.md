# ExamNotes AI 🚀

ExamNotes AI is a full-stack web application designed to help students accelerate their exam preparation. The platform leverages the Gemini AI API to generate structured, exam-focused study notes, complete with Markdown formatting, conceptual diagrams, and charts. It features a robust state management system, secure hybrid authentication, a simulated credit/payment pipeline, and a comprehensive administrative management dashboard.

---

## 🌟 Key Features

### 👤 User End-Points & Core Workflows
* **AI Notes Generation:** Generates comprehensive, well-structured study notes based on custom user prompts with integrated support for diagrams, charts, and structured JSON parsing.
* **Smart Study Tools:** Interactive note viewer with real-time markdown rendering and a single-click PDF export system for offline study.
* **Study Streak & Credit System:** Gamified user retention mechanism tracking consecutive study days alongside an active credit-deduction framework.
* **Mock Payment Gateway:** A complete simulated checkout pipeline with tier-based pricing cards and dynamic credit account balance updates.
* **History & Search:** A centralized user workspace to search, filter, and review previously generated notes.

### 🛡️ Admin Dashboard & Governance
* **Analytics Engine:** Real-time dashboard rendering system tracking global statistics, revenue approximations, and note generation rates.
* **User & Content Management:** Complete interface to search records, track individual user metrics, adjust credit metrics, or ban/unban problem accounts.
* **Notes Control:** Administrative data tables to audit generated content with full search and instant delete functionality.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Redux Toolkit, Tailwind CSS, Framer Motion, Axios |
| **Backend** | Node.js, Express.js, JWT (JsonWebToken), Cookie-Parser |
| **Database** | MongoDB, Mongoose ODM |
| **Security & Auth** | Firebase Client SDK, Firebase Admin SDK (Server-side verification) |
| **AI Processing** | Google Gemini AI API (Generative-AI) |

---

## 🏗️ System Architecture & Auth Flow

The platform relies on a secure cross-origin layout using strict HTTP-only cookies and a hybrid Firebase/JWT verification pipeline:

[ Frontend: React (client) ] --( Firebase Google Auth )--> [ Google Identity Providers ]
|                                                      |
(Send Secure Cookie)                                   (Return Identity Token)
|                                                      |
v                                                      v
[ Backend: Express (server) ] <--( Verify Token Headers )--- [ Firebase Admin SDK ]
|
(Issue custom JWT & HTTP-Only Lax Cookie)


1. **Authentication:** Users authenticate via Firebase Google Login. The frontend intercepts the token and forwards it to the Express engine.
2. **Session Verification:** The backend uses the `Firebase Admin SDK` to decode and cross-verify the payload.
3. **Session Management:** Once validated, the server issues an independent JWT securely locked inside an `httpOnly`, `sameSite: "lax"` cookie to eliminate client-side token vulnerabilities.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* MongoDB Database Instance (Local or Atlas)
* Firebase Project Credentials
* Google Gemini API Key

### 🖥️ Backend Setup (server)
1. Navigate to the server folder:
   ```bash
   cd server