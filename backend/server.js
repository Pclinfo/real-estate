// require('dotenv').config();
// const http = require('http'); // 🔸 Required to create HTTP server
// const { Server } = require('socket.io'); // 🔸 Import socket.io
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const createTables = require('./models/index');
// const authRoutes = require('./routes/authRoutes');
// const propertyRoutes = require('./routes/propertyRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const cityRoutes = require('./routes/cityRoutes');
// const appointmentRoutes = require("./routes/appointmentRoutes")
// const app = express();
// const PORT = process.env.PORT || 5000;
// const passwordResetRoutes = require("./routes/passwordResetRoutes");
// const messageRoutes = require("./routes/messageRoutes");
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
// app.use('/uploads/messages', express.static(path.join(__dirname, 'uploads/messages')));


// app.use('/api/auth', authRoutes);
// app.use('/api/properties', propertyRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use('/api/auth', profileRoutes);
// app.use("/api/auth/password-reset", passwordResetRoutes);
// app.use('/api', cityRoutes);
// app.use('/api/messages', messageRoutes);
// createTables().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// });
// // Socket.io logic
// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   socket.on("send_message", (data) => {
//     io.emit("receive_message", data); // Broadcast to everyone
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

require('dotenv').config();
const express = require('express');
const http = require('http'); // Required for socket.io
const { Server } = require('socket.io'); // Socket.io
const cors = require('cors');
const path = require('path');

// Routes and DB
const createTables = require('./models/index');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const profileRoutes = require('./routes/profileRoutes');
const cityRoutes = require('./routes/cityRoutes');
const appointmentRoutes = require("./routes/appointmentRoutes");
const passwordResetRoutes = require("./routes/passwordResetRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔌 Create HTTP server and initialize socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // change this in production
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));
app.use('/uploads/messages', express.static(path.join(__dirname, 'uploads/messages')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api/auth', profileRoutes);
app.use("/api/auth/password-reset", passwordResetRoutes);
app.use('/api', cityRoutes);
app.use('/api/messages', messageRoutes);

// DB and Server start
createTables().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});

// 🔌 Socket.io logic
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("📨 Received message:", data);
    io.emit("receive_message", data); // Broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});
