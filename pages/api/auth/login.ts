import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserService from '../../../lib/services/UserService';

interface LoginResponse {
    access_token?: string;
    refresh_token?: string;
    message?: string;
}

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization
 *
 * /api/auth/login:
 *   post:
 *     summary: Authenticates a user and returns JWT tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: JWT access token
 *                 refresh_token:
 *                   type: string
 *                   description: JWT refresh token
 *       400:
 *         description: Email and password are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       405:
 *         description: Method not allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while logging in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message explaining what went wrong
 */
export default async function loginHandler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const secretString = process.env.JWT_SECRET as string;
        const access_token = jwt.sign({ userId: user._id }, secretString, { expiresIn: '1h' });
        const refresh_token = jwt.sign({ userId: user._id }, secretString, { expiresIn: '7d' });

        // Store refresh_token in your database
        await UserService.storeRefreshToken(user._id, refresh_token);

        return res.status(200).json({ access_token, refresh_token });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'An error occurred while logging in' });
    }
}