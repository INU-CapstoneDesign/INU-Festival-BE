import express from "express";

import noticeRouter from "./routes/notice";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "hello" });
});

app.use("/notice", noticeRouter);

export default app;
