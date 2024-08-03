import "dotenv/config.js";
import createError from "http-errors";
import express from "express";
import path, { parse } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import session from "express-session";
import { createClient } from "redis";
import passport from "passport";
import RedisStore from "connect-redis";
import registerRouter from "./routes/register.js";
import pool from "./config/sqlDB.js";
// import loginRouter from "./routes/login.js";
import businessDashboardRouter from "./routes/businessDashboard.js"
import clientDashboardRouter from "./routes/clientDashboard.js"
import postRouter from "./routes/posts.js"
import cors from "cors";
import authRouter from "./routes/auth.js";
import chat from "./routes/chat.js";
// chat
import http from "http";
import { Server } from "socket.io";



// Constants
const port = process.env.PORT || 3000;
const clientHost = process.env.CLIENT_HOST;

// Redis Client Setup
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));



async function startServer() {
  try {
    // Connect to Redis
    await redisClient.connect();
    console.log('Connected to Redis');

    // Create http server
    const app = express();

    // Initialize SQL tables
    // const pool = await initializeDatabase();
    // console.log('Connected to SQL');

    // app.locals.pool = pool;

    // Enable CORS
    app.use(cors({
      origin: '*', // Allow requests from the client
      methods: 'GET,POST,OPTIONS',
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

    // Middleware to make user available in templates
    // app.use((req, res, next) => {
    //   console.log('Setting user in res.locals:', req.user);
    //   res.locals.user = req.user || null;
    //   next();
    // });

    // Routes
    app.use("/", indexRouter);
    app.use("/auth", authRouter);
    app.use("/register", registerRouter);
    app.use("/chats", chat);
    app.use("/businessdashboard", businessDashboardRouter);
    app.use("/clientdashboard", clientDashboardRouter);
    app.use("/posts", postRouter);


    // Route to print sessions for debugging
    app.get('/print-sessions', (req, res) => {
      res.json(req.session);
    });

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });

    // Chat
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    // Chat rooms
    const rooms = new Map()

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
        //  set the room in the rooms map
        rooms.set(room, {clientId, businessId});
        console.log(`Client ${clientId} joined room for business ${businessId}`);
        //  check if chat room exists
        await pool.query(` SELECT id FROM chats WHERE businessId = ? AND clientId = ?`, [businessId, clientId])
        .then(async (res) => {
          // if chat room does not exist, create a new chat room
          // if (res[0].length === 0) {
          //   console.log("No chat found for this user");
          //   await pool.query('INSERT INTO chats (businessId, clientId) VALUES (?, ?)', [businessId, clientId])
          //   .then(async()=> {
          //     // get the chatId of the newly created chat room
          //     await pool.query(` SELECT id FROM chats WHERE businessId = ? AND clientId = ?`, [businessId, clientId])
          //   })
          // } else {
          //   console.log(res[0][0].id);
          //   socket.emit('chatId', res[0][0].id);
          // }
        })
      });
      // Client sends a message
      socket.on('client chat message', async (msg) => {
        let { chatId, businessId, clientId, message } = msg;
        console.log(chatId, "chatId sent by client");
        const room = `business_${businessId}_client_${clientId}`;
        chatId = parseInt(chatId, 10);
        console.log(chatId, "chatId sent by client");
        console.log(`message: ${message} in room: ${room}`);

        // Store the message in the database
        await pool.query('INSERT INTO messages ( chatId, senderId, senderRole, message) VALUES (?, ?, ?, ?)', [chatId, clientId, "client", message]);

        // Emit the message to the specific room
        io.to(room).emit('chat message', msg);
      });
      // business sends a message
      socket.on('business chat message', async (msg) => {
        const { chatId, businessId, clientId, message } = msg;
        console.log(msg);
        const room = `business_${businessId}_client_${clientId}`;

        console.log(`message: ${message} in room: ${room}`);
        // chatId = parseInt(chatId, 10);
        // Store the message in the database
        await pool.query('INSERT INTO messages ( chatId, senderId, senderRole, message) VALUES (?, ?, ?, ?)', [chatId, businessId, "business", message]);

        // Emit the message to the specific room
        io.to(room).emit('chat message', msg);
      });
    });

    // Start http server
    server.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Failed to connect to db', err);
    process.exit(1);
  }
}

startServer();
