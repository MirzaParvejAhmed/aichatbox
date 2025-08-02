
import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import geminiRoutes from './routes/gemini.routes.js';
import cookieParser from 'cookie-parser' 
import cors from 'cors';
import path from 'path'; // Import the 'path' module

connect();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Middleware to set the cross-origin headers for the frontend
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

// Serve the static frontend files from the 'dist' directory
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use("/gemini",geminiRoutes);

app.get('/',(req,res)=>{
    res.send("welcome to the backend server");
});

// Catch-all route to serve the frontend's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

export default app;
