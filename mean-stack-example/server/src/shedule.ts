import * as mongodb from "mongodb";

export interface Shedule {
    _id?: string;
    train_name?: string;  
    date?: string;  
    seat?: boolean[]; 
    session_ID?: string;
}