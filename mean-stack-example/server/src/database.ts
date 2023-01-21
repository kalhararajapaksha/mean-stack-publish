import * as mongodb from "mongodb";
import { Employee } from "./employee";
import { Station } from "./Station";
import { Train } from "./train";
import { Shedule } from "./shedule";
 
export const collections: {
   employees?: mongodb.Collection<Employee>;
   stations?: mongodb.Collection<Station>;
   trains?: mongodb.Collection<Train>;
   shedules?: mongodb.Collection<Shedule>;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("meanStackExample");
   await applySchemaValidation(db);
 
   const employeesCollection = db.collection<Employee>("employees");
   const stationsCollection = db.collection<Station>("station");
   const trainCollection = db.collection<Train>("train");
   const sheduleCollection = db.collection<Shedule>("shedule");
   collections.employees = employeesCollection;
   collections.stations = stationsCollection;
   collections.trains = trainCollection;
   collections.shedules = sheduleCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["name", "position", "level"],
           additionalProperties: false,
           properties: {
               _id: {},
               name: {
                   bsonType: "string",
                   description: "'name' is required and is a string",
               },
               position: {
                   bsonType: "string",
                   description: "'position' is required and is a string",
                   minLength: 5
               },
               level: {
                   bsonType: "string",
                   description: "'level' is required and is one of 'junior', 'mid', or 'senior'",
                   enum: ["junior", "mid", "senior"],
               },
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "employees",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("employees", {validator: jsonSchema});
       }
   });
}