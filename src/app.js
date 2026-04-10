import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


import { ENV } from './config/env.js';


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

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Welcome to the Sihatek API',
        version: '1.0.0'
    });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// 404 Not Found Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: 'Resource not found',
    });
});




export default app;