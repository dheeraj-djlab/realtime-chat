# ChatSphere — Real-Time Chat Application

A real-time, multi-user chat web application built with **Node.js**, **Express**, and **Socket.IO**, using WebSockets for instant bidirectional communication between the server and connected clients.

## Features

- Real-time messaging with **Socket.IO** (WebSocket-based, no page refresh)
- Live "user joined / user left" notifications
- Online users list that updates instantly for everyone
- Typing indicator ("X is typing...")
- Message timestamps
- Clean, responsive chat UI (works on desktop and mobile)
- Single Express server serves both the frontend and the WebSocket connection (no CORS issues)

## Tech Stack

- **Backend:** Node.js, Express.js
- **Real-time layer:** Socket.IO (WebSockets)
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

## How It Works

1. Express serves the static frontend (`/public`).
2. When a client connects, Socket.IO opens a persistent WebSocket connection.
3. Events (`new-user-joined`, `send`, `typing`, `disconnect`, etc.) are emitted from the client and broadcast by the server to all connected sockets in real time.
4. The server keeps an in-memory map of connected users to track who's online.

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# (optional) run with auto-restart during development
npm run dev
```

Then open **http://localhost:8000** in two or more browser tabs/windows to see the real-time messaging in action.

## Project Structure

```
realtime-chat/
├── server.js              # Express + Socket.IO server
├── package.json
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── client.js
```

## Possible Future Enhancements

- Persist chat history in MongoDB/MySQL
- Private one-to-one messaging and chat rooms
- User authentication (JWT)
- Image/file sharing
- Deploy to Render/Railway with a custom domain

---

### For Resume / Portfolio

> **ChatSphere – Real-Time Chat Application**
> Built a real-time chat web app using Node.js, Express, and Socket.IO with live messaging, typing indicators, and an online-users panel powered by WebSocket events; designed a responsive UI and an in-memory presence system to track connected users.
