import * as mongodb from "mongodb";
 
export interface Station {
    _id?: mongodb.ObjectId;
    name: string;
}