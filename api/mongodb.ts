import { MongoClient, ObjectId } from "mongodb";

export async function findDocumentById(client: MongoClient, collectionName: string, id: string) {
  const db = client.db("portfolio");
  return await db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}

export async function findCollection(client: MongoClient, collectionName: string) {
  const db = client.db("portfolio");
  return db.collection(collectionName).find({}).toArray();
}

export async function insertDocument(client: MongoClient, collectionName: string, document: any) {
  const db = client.db("portfolio");
  await db.collection(collectionName).insertOne(document);
  return findCollection(client, collectionName);
}

export async function updateDocument(client: MongoClient, collectionName: string, id: string, updates: any) {
  const db = client.db("portfolio");
  await db.collection(collectionName).updateOne({ _id: new ObjectId(id) }, { $set: updates });
  return findCollection(client, collectionName);
}

export async function deleteDocument(client: MongoClient, collectionName: string, id: string) {
  const db = client.db("portfolio");
  await db.collection(collectionName).deleteOne({ _id: new ObjectId(id) });
  return findCollection(client, collectionName);
}
