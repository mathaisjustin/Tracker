import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // allow curl/postman
        origin === "http://localhost:3000" ||
        origin === "https://tracker.halonix.tech" ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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