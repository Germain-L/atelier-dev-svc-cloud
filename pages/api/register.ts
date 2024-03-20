import type {NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {IUser} from "../../types/interfaces/users";
import clientPromise from "../../lib/mongodb";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    try {
        const db = await clientPromise;
        const {email, password}: IUser = req.body;

        // Check if user already exists
        const existingUser = await db.collection('users').findOne({email});
        if (existingUser) {
            return res.status(409).json({message: 'User already exists'});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Store the new user
        const newUser = await db.collection('users').insertOne({
            email,
            password: hashedPassword,
        });

        return res.status(201).json({message: 'User created', userId: newUser.insertedId});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}
