import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import apiRouter from "./api/index";

dotenv.config({ path: process.env.NODE_ENV === "production" ? undefined : '.env' });

const app = express();
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(mongoUri);

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    app.locals.dbClient = client;

    app.set("view engine", "ejs")
      .use(express.urlencoded({ extended: true }))
      .use("/api", apiRouter)
      .use(express.static(__dirname));

    app.get("/", (req, res) => res.redirect("/api/data"));

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

startServer();

process.on('exit', () => {
  client.close();
});

export default app;
