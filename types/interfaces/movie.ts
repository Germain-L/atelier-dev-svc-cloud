import { ObjectId } from 'mongodb';

export interface IMovie {
  _id?: ObjectId;
  title: string;
  year: number;
  genres: string[];
  runtime: number;
  cast: string[];
  plot: string;
  poster: string;
}
