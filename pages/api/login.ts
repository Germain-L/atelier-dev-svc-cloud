import type {NextApiRequest, NextApiResponse} from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserService from '../../lib/services/UserService';

interface LoginRequest {
    email: string;
    password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'});
    }

    const {email, password}: LoginRequest = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    try {
        const user = await UserService.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        // for debugging lets hash the password and compare manually
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('Hashed Password:' + hashedPassword);
        console.log('Stored Hashed Password:', user.password);
        const check = hashedPassword === user.password;
        console.log('Password Match test:', check);

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const secretString = process.env.JWT_SECRET as string;
        const access_token = jwt.sign({userId: user._id}, secretString, {expiresIn: '1h'});

        // This line will not work as you're trying to use localStorage on the server-side.
        // localStorage.setItem('access_token', access_token);

        return res.status(200).json({access_token});
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({message: 'An error occurred while logging in'});
    }
}
