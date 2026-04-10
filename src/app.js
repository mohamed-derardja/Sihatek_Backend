import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import { ENV } from './config/env.js';

// Import routes
import setupRoutes from './routes/index.js';


const app = express();

app.use(cors(
    {
        origin: ENV.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
));


app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Set up routes
setupRoutes(app);




export default app;