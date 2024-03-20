import type {NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcryptjs';
import {IUser} from "../../types/interfaces/users";
import UserService from "../../lib/services/UserService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    const {email, name, password} = req.body as IUser;

    if (!email || !name || !password) {
        return res.status(400).json({message: 'Email, name, and password are required'});
    }

    const user = await UserService.getUserByEmail(email);
    if (user) {
        return res.status(409).json({message: 'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
        email,
        name,
        password: hashedPassword,
    };

    try {
        await UserService.createUser(newUser);
    } catch (error) {
        console.error("Failed to create user:", error);
        return res.status(500).json({message: 'An error occurred while creating the user'});
    }

    return res.status(201).json({message: 'User created successfully'});
}
