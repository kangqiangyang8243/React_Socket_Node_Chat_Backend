const dotenv = require("dotenv").config();
const authRoutes = require("./routes/auth");
const socket = require("socket.io");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT || 5555;

// dotenv.config();
app.use(cors());
// It parses incoming JSON requests and puts the parsed data in req.body.
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/users"));
app.use("/api/messages", require("./routes/messages"));

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(PORT, () => {
  console.log(`Backend start on port ${PORT}!`);
});

const io = socket(server, {
  cors: {
    origin:
      "*" ||
      "http://localhost:3000" ||
      "https://react-socket-node-chat-frontend.vercel.app/",

    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send_message", (message) => {
    const sendUserSocket = onlineUsers.get(message.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive_message", message.msg);
    }
  });
});
