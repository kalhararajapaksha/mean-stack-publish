import * as express from "express";
import * as mongodb from "mongodb";
import { collections } from "./database";

export const sheduleRouter = express.Router();
sheduleRouter.use(express.json());

sheduleRouter.get("/", async (_req, res) => {
    try {
        const shedule = await collections.shedules.find({}).toArray();
        res.status(200).send(shedule);
    } catch (error) {
        res.status(500).send(error.message);
    }
 });

 sheduleRouter.get("/:date", async (req, res) => {
    try {
        //const date = new Date(req.params.date);
        const query = { date: { $eq: req.params.date } };
        const shedule = await collections.shedules.find(query).toArray();
        res.status(200).send(shedule);
    } catch (error) {
        res.status(500).send(error.message);
    }
 });