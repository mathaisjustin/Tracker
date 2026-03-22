import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://tracker.halonix.tech",
];

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "backend running" });
});

// All API routes
app.use("/api", apiRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});