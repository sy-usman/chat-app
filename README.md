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

