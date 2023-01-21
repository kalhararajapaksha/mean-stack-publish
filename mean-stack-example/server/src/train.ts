import * as mongodb from "mongodb";
 
export interface Train {
    _id?: mongodb.ObjectId;
    train_name: string;
    time: string;
    seat_count: number;
    ticket_price: number;
    img_url?: string;
}