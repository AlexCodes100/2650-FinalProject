import "dotenv/config.js";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index.js";
import session from "express-session";
import { createClient } from "redis";
import passport from "passport";
import RedisStore from "connect-redis";
import registerRouter from "./routes/register.js";
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

    // view engine setup
    app.set("views", path.join("views"));
    app.set("view engine", "pug");

    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join("public")));

    // Enable CORS
    app.use(cors({
      origin: process.env.CORS_ORIGIN,
    }));
    // app.use(cors());

    // Session management (Redis)
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
      })
    );

    // Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // Middleware to make user available in templates
    app.use((req, res, next) => {
      console.log('Setting user in res.locals:', req.user);
      res.locals.user = req.user || null;
      next();
    });

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
    origin: "http://localhost:4000",
    methods: ["GET", "POST"],
  },
});

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

      // Join a room for one-to-one chat
      socket.on('join', ({ businessId, clientId }) => {
        const room = `business_${businessId}_client_${clientId}`;
        socket.join(room);
        console.log(`Client ${clientId} joined room for business ${businessId}`);
      });
      // Client sends a message
      socket.on('client chat message', async (msg) => {
        const { chatId, businessId, clientId, chatContent } = msg;
        const room = `business_${businessId}_client_${clientId}`;

        console.log(`message: ${chatContent} in room: ${room}`);

        // Store the message in the database
        await pool.query('INSERT INTO messages ( chatId, senderId, senderRole, chatContent) VALUES (?, ?, ?)', [chatId, clientId, "client", chatContent]);

        // Emit the message to the specific room
        io.to(room).emit('chat message', msg);
      });
      // business sends a message
      socket.on('business chat message', async (msg) => {
        const { chatId, businessId, clientId, chatContent } = msg;
        const room = `business_${businessId}_client_${clientId}`;

        console.log(`message: ${chatContent} in room: ${room}`);

        // Store the message in the database
        await pool.query('INSERT INTO messages ( chatId, senderId, senderRole, chatContent) VALUES (?, ?, ?)', [chatId, businessId, "business", chatContent]);

        // Emit the message to the specific room
        io.to(room).emit('chat message', msg);
      });
    });

    // Start http server
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Failed to connect to db', err);
    process.exit(1);
  }
}

startServer();
