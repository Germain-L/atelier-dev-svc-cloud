import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  email: string;
  name: string;
  password: string;
  refresh_token?: string;
}
