import {ObjectId} from "mongodb";

export interface IComment {
    _id: ObjectId,
    name: string,
    email: string,
    movie_id: ObjectId,
    text: string,
    date: Date
}