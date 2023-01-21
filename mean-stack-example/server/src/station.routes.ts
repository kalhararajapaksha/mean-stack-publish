import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const stationRouter = express.Router();
stationRouter.use(express.json());

stationRouter.get("/", async (_req, res) => {
    try {
        const stations = await collections.stations.find({}).toArray();
        res.status(200).send(stations);
    } catch (error) {
        res.status(500).send(error.message);
    }
 });
 