import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";
// @ts-ignore
import cookieParser from "cookie-parser";



// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

const DEBUG_REQUEST_LOGS = process.env.DEBUG_REQUEST_LOGS === "true";

app.use((req, _res, next) => {
  if (DEBUG_REQUEST_LOGS) {
    console.log("---- INCOMING REQUEST ----");
    console.log("METHOD:", req.method);
    console.log("ENV:", process.env.NODE_ENV);

    // Path only (no query params)
    console.log("PATH:", req.path);

    // Redacted auth header
    console.log("HEADERS:", {
      authorization: req.headers.authorization ? "[REDACTED]" : undefined,
      origin: req.headers.origin,
    });

    console.log("--------------------------");
  }

  next();
});

// CORS configuration - for Render production
const corsOptions = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-live-domain.com"
    ],
    credentials: true,
  })
);
app.options(/.*/, cors(corsOptions)); // Preflight handler for all routes
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory with proper CORS headers
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  },
  express.static(path.join(__dirname, "../uploads")),
);

// Health check endpoint for monitoring
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// Routes
app.use("/api", routes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
