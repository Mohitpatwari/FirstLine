Markdown
<div align="center">

# 🚨 FirstLine

**Real-Time, Geo-Aware Emergency Response & Dispatch Platform**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io)](https://socket.io/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)

[Features](#-key-features) · [Architecture](#-architecture--engineering) · [Environment Setup](#-environment-variables) · [Quick Start](#-quick-start)

</div>

---

## 💡 About The Project

**FirstLine** is a production-ready, full-stack emergency dispatch application designed to bridge the gap between people in crisis and nearby qualified volunteers. 

Unlike standard CRUD applications, FirstLine tackles complex real-world engineering challenges. It leverages **Socket.io** for persistent, real-time incident broadcasting, utilizes **MongoDB `2dsphere` geospatial indexing** for high-speed proximity calculations, and integrates an **AI/LLM engine** to deterministically rank and dispatch the most suitable responders. Security is handled natively via a custom, passwordless Email OTP flow utilizing JWT Access/Refresh token rotation.

---

## ✨ Key Features

*   **Real-Time SOS Broadcasting:** One-tap incident reporting via WebSockets. Dashboard maps and nearby volunteer clients update instantly without page refreshes.
*   **Geospatial Auto-Dispatch:** Uses MongoDB `$near` and `$geometry` queries to instantly locate volunteers within a specific incident radius (500m - 2km).
*   **AI Responder Ranking:** Passes volunteer metrics (rating, trust score, skill match, proximity) to GPT-4o-mini to return a deterministic JSON array of the best candidates for the specific emergency type.
*   **Per-Incident Live Chat:** Isolated Socket.io rooms generated dynamically for each incident, allowing secure coordination between victims and dispatched responders.
*   **Passwordless Email Authentication:** Custom OTP login flow built with Nodemailer, bypassing vulnerable password storage.
*   **Microservice-Ready Deployment:** Configured with dynamic CORS handling to support split deployments (e.g., React frontend on Vercel, Node/WebSocket backend on Render).

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7, React-Leaflet |
| **Backend** | Node.js, Express, Socket.io, JWT, bcrypt, Multer |
| **Database** | MongoDB (Native `2dsphere` indexes & GeoJSON formatting) |
| **Integrations** | OpenAI API (Dispatch logic), Nodemailer (SMTP Auth/Alerts), Cloudinary (Media) |

---

## 🏗 Architecture & Engineering

### The Dispatch Pipeline
When a user triggers an SOS, the system executes the following flow in under 800ms:

1. **Geospatial Query:** MongoDB calculates distances and returns candidates within the exact radius.
2. **Composite Scoring:** Candidates are pre-filtered based on trust score and availability.
3. **LLM Re-Ranking:** GPT-4o-mini evaluates the crisis context and ranks responders.
4. **WebSocket Broadcast:** The top-ranked responder receives a direct Socket `VOLUNTEER_DISPATCHED` event.
5. **SMTP Fallback:** Nodemailer simultaneously fires an urgent email alert to the responder's inbox.

---

## ⚙️ Environment Variables

To run this project locally, create a `.env` file in your `backend` directory with the following keys:

```env
# Server & CORS
PORT=5050
NODE_ENV=development
CORS_ORIGIN_DEV=http://localhost:5173
CORS_ORIGIN_PROD=[https://your-frontend-domain.vercel.app](https://your-frontend-domain.vercel.app)

# Database
MONGO_URI=mongodb://localhost:27017/firstline

# Security & JWT
ACCESS_TOKEN_SECRET=your_super_secret_access_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
REFRESH_TOKEN_EXPIRY=10d

# Email / Nodemailer (App Passwords)
EMAIL_USER=your_project_email@gmail.com
EMAIL_APP_PASSWORD=your_16_digit_app_password

# External APIs
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Cloudinary (Avatar Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
🚀 Quick Start
1. Clone the repository

Bash
git clone [https://github.com/your-username/firstline.git](https://github.com/your-username/firstline.git)
cd firstline
2. Start the Backend (Terminal 1)

Bash
cd backend
npm install
npm run dev
3. Start the Frontend (Terminal 2)

Bash
cd frontend
npm install
npm run dev
🔧 Deployment Notes
Because this application relies heavily on WebSockets (Socket.io) for real-time emergency broadcasting, the backend cannot be hosted on serverless platforms like Vercel.

Frontend: Deployed via Vercel (Static CDN).

Backend: Deployed via Render / Railway (Persistent Web Service to maintain open Socket connections).

Keep-Alive: Includes a /ping route to prevent Render's free tier from sleeping during critical monitoring periods.
