// import 'dotenv/config'
// import http from 'http';
// import app from './app.js';
// import {Server} from 'socket.io'
// import jwt from "jsonwebtoken";
// import mongoose from 'mongoose';
// import projectModel from './models/project.model.js';
// import { generateResult } from './services/gemini.service.js';


// const port = process.env.PORT || 3000;
// const server = http.createServer(app);
// const io =new Server(server,{
//     cors:{
//         origin:'*'
//     }
// })
     
//  io.use(async (socket,next)=>{
//     try{
//         const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
//         if(!token){
//             return next(new Error('Authentication Error'))
//         }
//         const projectId = socket.handshake.query.projectId;
//         if(!mongoose.Types.ObjectId.isValid(projectId)){
//             return next(new Error('Invalid ProjectId'));
//         }
//         socket.project = await projectModel.findById(projectId);

//         const decoded = jwt.verify(token,process.env.JWT_SECRET);
//         if(!decoded){
//             return next(new Error('Authentication Error'))
//         }
//         socket.user =decoded;
//             next();

//     }catch(error){
//         next(error)
//     }
// })
// io.on('connection', socket => {
//     socket.roomId = socket.project._id.toString()
//     console.log('a user connected');
//     socket.join(socket.roomId);

//     socket.on('project-message', async data=>{
//         const message =data.message;
//         const aiIsPresentInMessage =message.includes('@ai');
//          socket.broadcast.to(socket.roomId).emit('project-message',data)
//         if (aiIsPresentInMessage){
//             const contents =message.replace('@ai','');
//             const result = await generateResult(contents);
//             io.to(socket.roomId).emit('project-message',{
//                 message:result,
                
//                 sender:{
//                     _id:'ai',
//                     email:'AI',
                   
//                 }
            
//             })
    
//             return
//         }
   
//     })

//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//     socket.leave(socket.roomId)
//    });
// });

// server.listen(port,()=>{
//     console.log(`Server is running on port ${port}`);
// })


// server.js
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
const io = new Server(server, { cors: { origin: '*' } });

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
        const input = message.replace('@ai', '');
        const result = await generateResult(input);

        io.to(room).emit('project-message', {
          message: result,
          sender: { _id: 'ai', email: 'AI' }
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from project ${room}`);
      socket.leave(room);
    });
  });
}

start();
