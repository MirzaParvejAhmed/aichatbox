import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/gemini.service.js';

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const allowedOrigins = ["https://aichatbox-02v6.onrender.com"];

// Initialize Socket.IO with CORS options
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

async function start() {
  try {
    // 1. Connect to MongoDB before anything else
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(' MongoDB connected');

    // 2. Only after successful connection, set up Socket.IO
    setupSocket();

    // 3. Then start the server
    server.listen(port, () => {
      console.log(` Server listening on port ${port}`);
    });
  } catch (err) {
    console.error(' MongoDB connection failed:', err);
    process.exit(1);
  }
}

function setupSocket() {
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) return next(new Error('Authentication Error'));

      const projectId = socket.handshake.query.projectId;
      if (!mongoose.Types.ObjectId.isValid(projectId))
        return next(new Error('Invalid ProjectId'));

      const project = await projectModel.findById(projectId);
      if (!project) return next(new Error('Project Not Found'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) return next(new Error('Authentication Error'));

      socket.project = project;
      socket.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  });

  io.on('connection', (socket) => {
    const room = socket.project._id.toString();
    socket.join(room);
    console.log(`User connected to project ${room}`);

    socket.on('project-message', async (data) => {
      const { message } = data;
      const aiTrigger = message.includes('@ai');
      socket.broadcast.to(room).emit('project-message', data);

      if (aiTrigger) {
        try {
          const input = message.replace('@ai', '');
          const result = await generateResult(input);
          
          // === UPDATED: Add a check for a valid AI response object ===
          if (result && (result.text || result.fileTree)) {
            io.to(room).emit('project-message', {
              message: result,
              sender: { _id: 'ai', email: 'AI' }
            });
          } else {
            console.error("AI returned an empty or malformed response:", result);
            io.to(room).emit('project-message', {
              message: { text: "I'm sorry, I couldn't generate a response. Please try again." },
              sender: { _id: 'ai', email: 'AI' }
            });
          }
        } catch (error) {
          console.error("Error generating AI response:", error);
          io.to(room).emit('project-message', {
            message: { text: "An error occurred while generating the AI response. Please try again later." },
            sender: { _id: 'ai', email: 'AI' }
          });
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from project ${room}`);
      socket.leave(room);
    });
  });
}

start();
