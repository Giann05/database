import express, { Request, Response } from "express";
import { createClient, createPool } from "@vercel/postgres";
const client = createClient({
  connectionString:
    "postgres://default:Ko9PCdeSg6AD@ep-polished-salad-a4kl47ln.us-east-1.aws.neon.tech:5432/verceldb",
});
const app = require("express")();
const port = process.env.PORT || 3000;
const server = express.json();
app.use(server);
(async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
})();
app.get("/", (request: Request, response: Response) => {
  response.status(200).json({ message: "Hello World!" });
});
app.post("/posts", async (request: Request, response: Response) => {
  try {
    const { title, content } = request.body;
    if (!title || !content) {
      return response
        .status(400)
        .json({ error: "titolo e contenuto sono richiesti" });
    }
    const query = "INSERT INTO posts (title, content) VALUES ($1, $2)";
    const values = [title, content];

    await client.query(query, values);
    response.status(201).json({ message: "Post creato con successo" });
  } catch (error) {
    response.status(500).json(error);
  }
});
app.get("/posts", async (request: Request, response: Response) => {
  const result = await client.query("SELECT * FROM posts");
  response.status(200).json(result.rows);
});
app.get("/posts:id", async (request: Request, response: Response) => {
  const result = await client.query(
    `SELECT FROM posts WHERE id=${request.params.id}`
  );
  response.status(200).json(result.rows);
});
app.delete("/posts:id", async (request: Request, response: Response) => {
  const id = request.params.id;
  const query = `DELETE FROM posts WHERE id=${id}`;
  await client.query(query);
  response.status(201).json({ message: "dati cancellati con successo" });
});
app.patch("/posts:id", async (request: Request, response: Response) => {
  const result = await client.query(
    `UPDATE posts SET title=$1, content=$2 WHERE id=$3{request.params.id} [${request.body.title}, ${request.body.content}, ${request.params.id}]`
  );
  response.status(200).json(result.rows);
});
app.listen(port, () => {
  console.log(`server in ascolto alla porta http://localhost:${port}`);
});
