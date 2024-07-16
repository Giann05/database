import express, { Request, Response } from "express";
const app = require("express")();
const port = process.env.PORT || 3000;
const server = express.json();
app.use(server);
app.get("/posts", (request: Request, response: Response) => {
  response.status(200).json({ message: "Hello World!" });
});
app.listen(port, () => {
  console.log(`server in ascolto alla porta http://localhost:${port}`);
});
