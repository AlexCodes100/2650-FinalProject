import "dotenv/config.js";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import passport from "passport";
import registerRouter from "./routes/register.js";
import pool from "./config/sqlDB.js";
import businessDashboardRouter from "./routes/businessDashboard.js";
import clientDashboardRouter from "./routes/clientDashboard.js";
import postRouter from "./routes/posts.js";
import cors from "cors";
import authRouter from "./routes/auth.js";
import chat from "./routes/chat.js";
import http from "http";
import { Server } from "socket.io";

// Constants
const port = process.env.PORT || 3000;
const clientHost = process.env.CLIENT_HOST;

// Create Express application
const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Allow requests from the client
  methods: 'GET,POST,OPTIONS,PUT,DELETE',
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization'
}));

// view engine setup
app.set("views", path.join("views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join("public")));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/register", registerRouter);
app.use("/chats", chat);
app.use("/businessdashboard", businessDashboardRouter);
app.use("/clientdashboard", clientDashboardRouter);
app.use("/posts", postRouter);

// CORS test route
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Start the server and chat setup
async function startServer() {
  try {
    // Create http server
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
        credentials: true,
      },
    });

    // Chat rooms
    const rooms = new Map();

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', ({ businessId, clientId }) => {
        console.log('User disconnected');
        const room = `business_${businessId}_client_${clientId}`;
        socket.leave(room);
        rooms.delete(room);
      });

      // Join a room for one-to-one chat
      socket.on('join', async ({ businessId, clientId }) => {
        const room = `business_${businessId}_client_${clientId}`;
        socket.join(room);
        socket.roomId = room;
        socket.clientId = clientId;
        socket.businessId = businessId;
        rooms.set(room, { clientId, businessId });
        console.log(`Client ${clientId} joined room for business ${businessId}`);
        await pool.query(`SELECT id FROM chats WHERE businessId = ? AND clientId = ?`, [businessId, clientId]);
      });

      // Client sends a message
      socket.on('client chat message', async (msg) => {
        let { chatId, businessId, clientId, message } = msg;
        const room = `business_${businessId}_client_${clientId}`;
        chatId = parseInt(chatId, 10);
        console.log(`message: ${message} in room: ${room}`);
        await pool.query('INSERT INTO messages (chatId, senderId, senderRole, message) VALUES (?, ?, ?, ?)', [chatId, clientId, "client", message]);
        io.to(room).emit('chat message', msg);
      });

      // Business sends a message
      socket.on('business chat message', async (msg) => {
        const { chatId, businessId, clientId, message } = msg;
        const room = `business_${businessId}_client_${clientId}`;
        console.log(`message: ${message} in room: ${room}`);
        await pool.query('INSERT INTO messages (chatId, senderId, senderRole, message) VALUES (?, ?, ?, ?)', [chatId, businessId, "business", message]);
        io.to(room).emit('chat message', msg);
      });
    });

    // Start http server
    server.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

startServer();
