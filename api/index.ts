import express from "express";
import personalDataRouter from "./routes/personalDataRouter";

const apiRouter = express.Router();

apiRouter.use("/data", personalDataRouter);

export default apiRouter;