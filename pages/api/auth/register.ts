import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import UserService from '../../../lib/services/UserService';
import { IUser } from '../../../types/interfaces/users';

interface RegisterResponse {
  message: string;
}
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and registration
 *
 * /api/users/register:
 *   post:
 *     summary: Registers a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               name:
 *                 type: string
 *                 description: User's full name
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         description: Email, name, and password are required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while creating the user
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, password } = req.body as IUser;

  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ message: 'Email, name, and password are required' });
  }

  try {
    const userExists = await UserService.getUserByEmail(email);
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await UserService.createUser({ email, name, password: hashedPassword });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Failed to create user:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred while creating the user' });
  }
}
