import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";

import pinoHttp from "pino-http";

import { cleanEnv, str, port } from "envalid";

import logger from "./config/logger.js";
import connectDB from "./config/mongoDB.js";

import limiter from "./middleware/rateLimiting.js";

// Validate env
const env = cleanEnv(process.env, {
    PORT: port({ default: 5000 }),
    MONGODB_URI: str({ default: "" }),
    NODE_ENV: str({ default: "development" }),
});

const app = express();
const PORT = env.PORT;

app.use(pinoHttp({ logger }));

// Security Middlewares
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());

app.use("/api", limiter);

// Core Middlewares
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10kb" }));
app.use(compression());

// Health Check
app.get("/", (req, res) => {
    res.send("API is running");
});

// Sample Route
app.get("/api/test", (req, res) => {
    res.json({ success: true, message: "Working perfectly" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    logger.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

// Start Server
const startServer = async () => {
    if (env.MONGODB_URI) {
        await connectDB();
    } else {
        logger.warn("MongoDB URI not provided, skipping DB connection");
    }

    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
};

startServer();