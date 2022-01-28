const express = require("express");
const app = express();

let streamer;
const port = 4040;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static(__dirname));

io.sockets.on("error", e => console.log(e));
io.sockets.on("connection", socket => {
  socket.on("streamer", () => {
    streamer = socket.id;
    socket.broadcast.emit("streamer");
  });
  socket.on("headset", () => {
    socket.to(streamer).emit("headset", socket.id);
  });
  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });
  socket.on("disconnect", () => {
    socket.to(streamer).emit("disconnectPeer", socket.id);
  });
});
server.listen(port, () => console.log(`Server is running on port ${port}`));