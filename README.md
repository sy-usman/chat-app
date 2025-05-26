# 💬 Real-Time Chat App with Dialogflow, WebSockets & SvelteKit

Welcome to the **AI-powered real-time chat app**! This project connects users to a smart assistant (powered by Dialogflow) through a seamless web chat interface. It's fast, simple, and perfect for real-time support, suggestions, or information retrieval.

## 🔍 Overview

This project demonstrates:
- **Real-time WebSocket communication** between frontend and backend.
- A **Dialogflow-integrated chatbot** for AI responses.
- A **beautiful SvelteKit frontend** with Tailwind CSS.
- **Secure tunneling with ngrok** for public access.
- Smooth **Axios-based API calls** to backend endpoints.
  
Whether you're debugging, prototyping, or building for production — this setup is solid.

## 🧠 Tech Stack

| Layer         | Tech Used                  | Purpose                                    |
|---------------|----------------------------|--------------------------------------------|
| Frontend      | SvelteKit + Tailwind CSS   | UI & WebSocket handling                    |
| Backend       | WebSocket + Dialogflow     | Message handling and AI response           |
| API Layer     | Axios                      | Easy and elegant API calls                 |
| AI Engine     | Google Dialogflow CX/ES    | Natural Language Understanding             |
| Tunnel        | ngrok                      | Expose localhost for Dialogflow to access  |


## 🗂️ Folder Structure

src/
├── routes/
│   ├── api/
│   │   └── dialogflow/
│   │       └── webhook/+server.ts     # Dialogflow webhook
│   └── ws/
│       └── +server.ts                 # WebSocket endpoint

1. Clone the Repo

git clone https://github.com/sy-usman/chat-app.git
cd chat-app

🔧 Step-by-Step Setup
2. Install Dependencies
Make sure you have Node.js v20 installed.
npm install

3. Setup Dialogflow Credentials
Create a Dialogflow agent (Console: Dialogflow console).
Generate and download your service account JSON.


4. Update .env file
Create a .env file in root:

DIALOGFLOW_PROJECT_ID=your-dialogflow-project-id
GOOGLE_APPLICATION_CREDENTIALS=./dialogflow-key.json

5. Start/install ngrok Tunnel
you can go to official website of ngrok, after signup it generates a auth token, copy and paste it to terminal.
npx ngrok http 5173

paste the below url in dialogflow webhook
https://<your-ngrok-url>/api/dialogflow/webhook
💡 Make sure you whitelist this URL in your Vite config under server.allowedHosts.

6. Run the Dev Server

npm run dev
Your app will be live at:
http://localhost:5173 - svelte
npx ngrok http 5173
https://xxxx-xxxx-xxxx.ngrok-free.app

💡 Features
📡 Real-Time WebSockets — every message is instantly broadcast.

🧠 AI Responses via Dialogflow — ask anything.

⚡ Axios-based API Integration — clean and scalable.

🧵 Threaded conversation flow for rich interactions.

💬 Sample Flow
User sends a message.

Message is sent via WebSocket to the backend.

Backend forwards it to Dialogflow using its SDK.

Response is returned to the frontend and displayed in real-time.

📦 Scripts
npm run dev          # Run frontend and backend locally
npm run build        # Build the project for production
npx ngrok http 5173  # Create public tunnel to localhost
🛠 Tools Used
SvelteKit — Framework for fast, modern web apps

TailwindCSS — Utility-first CSS for styling

Dialogflow — Natural language AI agent

Axios — For clean API requests

WebSocket — Real-time messaging

Ngrok — Tunneling tool to expose local server

🧪 Troubleshooting
🔐 403 Forbidden? Make sure your vite.config.ts includes allowedHosts for the ngrok domain.

🔌 WebSocket not connecting? Ensure your endpoint is /ws and hosted on correct origin.



