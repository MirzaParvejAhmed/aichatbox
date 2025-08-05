
import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import geminiRoutes from './routes/gemini.routes.js';
import cookieParser from 'cookie-parser' 
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

connect();

const app = express();

app.use((req, res, next) => {
    // These headers are crucial for WebContainer to work
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

app.use(cors({
    origin: 'https://aichatbox-02v6.onrender.com'
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// Use fileURLToPath to get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve to the project root, which is one level up from the 'backend' folder
const projectRoot = path.resolve(__dirname, '..');

// Serve static files from the correct frontend/dist path
app.use(express.static(path.join(projectRoot, 'frontend/dist')));

app.use('/users',userRoutes);
app.use('/projects',projectRoutes);
app.use("/gemini",geminiRoutes);

// Catch-all route to serve the frontend's index.html from the correct path
app.get('*', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend/dist', 'index.html'));
});

export default app;
```
