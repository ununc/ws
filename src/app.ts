import express from "express";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "./websocket";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: "*", // 개발 중에는 모든 origin 허용
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const wss = new WebSocketServer(server);
wss.initialize().catch(console.error);

const PORT = process.env.PORT ?? 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing server");
  wss.close();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
