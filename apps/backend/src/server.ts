import express from "express";

const app = express();

app.get("/health", (req, res) => {
res.json({ status: "backend running" });
});

const PORT = 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
