import express, { Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "production" ? undefined : '.env' });

const app = express();
const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
const getTimestamp = () => new Date().toLocaleString();

app
  .set("view engine", "ejs")
  .use(express.urlencoded({ extended: true }));

client
  .connect()
  .then(() => console.log(getTimestamp(), "Connected to MongoDB"))
  .catch(err => console.error(getTimestamp(), "Failed to connect to MongoDB", err));

app.get("/", (req, res) => res.redirect("/data"));

app.get("/data", async (req, res) => {
  try {
    const data = await client.db("portfolio").collection("personalData").find({}).toArray();
    res.render("personalData", { data });
  } catch (err) {
    console.error("Error fetching data", err);
    res.status(500).render("error", { error: "Error fetching data" });
  }
});

app.post("/create", async (req, res) => handleDataOperation(res, async () => {
  const personalDataCollection = client.db("portfolio").collection("personalData");
  await personalDataCollection.insertOne(req.body);
  return personalDataCollection.find({}).toArray();
}, "Error creating data"));

app.put("/update/:id", async (req, res) => handleDataOperation(res, async () => {
  const personalDataCollection = client.db("portfolio").collection("personalData");
  await personalDataCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
  return personalDataCollection.find({}).toArray();
}, "Error updating data"));

app.delete("/delete/:id", async (req, res) => handleDataOperation(res, async () => {
  const personalDataCollection = client.db("portfolio").collection("personalData");
  await personalDataCollection.deleteOne({ _id: new ObjectId(req.params.id) });
  return personalDataCollection.find({}).toArray();
}, "Error deleting data"));

app.listen(process.env.PORT || 3000, () => {
  console.log(getTimestamp(), `Server is running at http://localhost:${process.env.PORT || 3000}`);
});

process.on("SIGINT", () => {
  client.close().then(() => {
    console.log(getTimestamp(), "MongoDB connection closed");
    process.exit(0);
  });
});

async function handleDataOperation(res: Response, operation: () => Promise<any>, errorMessage: string) {
  try {
    const data = await operation();
    res.render("partials/dataList", { data });
  } catch (err) {
    console.error(errorMessage, err);
    res.status(500).send(errorMessage);
  }
}
