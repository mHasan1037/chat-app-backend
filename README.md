# 🛠️ Chat App Backend

A robust RESTful API and real-time WebSocket server for the Chat App, built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Socket.IO**. Includes authentication, friend requests, messaging, posts, likes, comments, image uploads, and an AI chat route.

🔗 **Frontend:** [chat-app-frontend-eight-woad.vercel.app](https://chat-app-frontend-eight-woad.vercel.app)

---

## 🚀 Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express v5 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO |
| Authentication | JSON Web Tokens (JWT) + bcryptjs |
| Image Uploads | Cloudinary + Multer + Streamifier |
| Email | Nodemailer |
| Dev Tools | ts-node-dev, Nodemon |

---

## ✨ Features

- **JWT Authentication** — secure register, login, and protected routes
- **Password hashing** with bcryptjs
- **Real-time messaging** via Socket.IO
- **Friend request system** — send, accept, and manage friend requests
- **Chat & Messages** — one-to-one conversations with message history
- **Posts, Likes & Comments** — social feed functionality
- **Image uploads** to Cloudinary via Multer (streamed, no disk storage)
- **Email support** via Nodemailer (e.g. verification, notifications)
- **AI route** — dedicated endpoint for AI-powered chat features
- **CORS configured** for frontend integration
- **Fully typed** with TypeScript

---

## 📁 Project Structure

```
chat-app-backend/
├── config/
│   └── db.ts              # MongoDB connection
├── controllers/           # Route handler logic
├── middleware/            # Auth and other middleware
├── models/                # Mongoose schemas & models
├── routes/                # Express route definitions
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   ├── friendRequestRoutes.ts
│   ├── chatRoutes.ts
│   ├── messageRoutes.ts
│   ├── postRoutes.ts
│   ├── likeRoutes.ts
│   ├── commentRoutes.ts
│   └── aiRoutes.ts
├── utils/                 # Utility/helper functions
├── app.ts                 # Express app setup & route mounting
├── server.ts              # HTTP + Socket.IO server entry point
└── tsconfig.json
```

---

## 📡 API Endpoints

| Prefix | Description |
|---|---|
| `/api/auth` | Register, login, logout |
| `/api/users` | User profile management |
| `/api/friends` | Friend requests & relationships |
| `/api/chats` | Chat rooms / conversations |
| `/api/messages` | Messages within chats |
| `/api/posts` | Social feed posts |
| `/api/likes` | Like/unlike posts |
| `/api/comments` | Comments on posts |
| `/api/ai` | AI-powered chat features |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account

### Installation

```bash
git clone https://github.com/mHasan1037/chat-app-backend.git
cd chat-app-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### Running the Development Server

```bash
npm run dev
```

The server will start with hot-reloading via `ts-node-dev`.

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled production build |

---

## 🔌 WebSocket Events (Socket.IO)

The server uses Socket.IO alongside the HTTP server for real-time features. Common events include:

- **Connection / Disconnection** — track online users
- **Send Message** — broadcast new messages to chat participants
- **Typing Indicators** — notify when a user is typing

---

## 🚢 Deployment

1. Run `npm run build` to compile TypeScript.
2. Deploy the `dist/` folder to your hosting provider (e.g. Railway, Render, or a VPS).
3. Set all required environment variables on the platform.
4. Start the server with `npm run start`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.
