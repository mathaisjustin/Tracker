import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      /\.vercel\.app$/,
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", routes);

app.get("/health", (req, res) => {
  res.json({ status: "backend running" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});