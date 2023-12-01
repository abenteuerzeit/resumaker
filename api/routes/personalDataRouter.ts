import express, { Response } from "express";
import { PersonalData } from "../../types/types";
import * as db from "../mongodb";
import { MongoClient } from "mongodb";

const personalDataRouter = express.Router();

async function handleDataOperation(client: MongoClient, res: Response, operation: () => Promise<any>, errorMessage: string) {
  try {
    const data = await operation();
    res.render("partials/dataList", { data });
  } catch (err) {
    console.error(errorMessage, err);
    res.status(500).send(errorMessage);
  }
}

function isPersonalData(data: any): data is PersonalData {
  return data 
      && typeof data.name === 'string' 
      && typeof data.address === 'object'
      && typeof data.contact === 'object'
      && typeof data.socialProfiles === 'object';
}

personalDataRouter.param('_id', async (req, res, next, _id) => {
  try {
    const client = req.app.locals.dbClient;
    const data = await db.findDocumentById(client, "personalData", _id);
    if (isPersonalData(data)) {
      req.personalData = data;
      next();
    } else {
      res.status(404).send("Personal data not found");
    }
  } catch (err) {
    console.error("Error fetching personal data", err);
    res.status(500).send("Error fetching personal data");
  }
});

personalDataRouter.get("/", async (req, res) => {
  const client = req.app.locals.dbClient;
  await handleDataOperation(client, res, () => db.findCollection(client, "personalData"), "Error fetching data");
});

personalDataRouter.post("/create", async (req, res) => {
  const client = req.app.locals.dbClient;
  await handleDataOperation(client, res, () => db.insertDocument(client, "personalData", req.body), "Error creating data");
});

personalDataRouter.put("/update/:id", async (req, res) => {
  const client = req.app.locals.dbClient;
  await handleDataOperation(client, res, () => db.updateDocument(client, "personalData", req.params.id, req.body), "Error updating data");
});

personalDataRouter.delete("/delete/:id", async (req, res) => {
  const client = req.app.locals.dbClient;
  await handleDataOperation(client, res, () => db.deleteDocument(client, "personalData", req.params.id), "Error deleting data");
});

export default personalDataRouter;
