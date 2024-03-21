import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import UserService from '../../../lib/services/UserService';

interface RefreshTokenResponse {
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
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refreshes JWT access and refresh tokens
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: The refresh token issued during login or previous token refresh
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   description: New JWT access token
 *                 refresh_token:
 *                   type: string
 *                   description: New JWT refresh token
 *       400:
 *         description: Refresh token is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: An error occurred while refreshing token
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
  res: NextApiResponse<RefreshTokenResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  let decoded: any;

  try {
    decoded = jwt.verify(refresh_token, process.env.JWT_SECRET as string);
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  try {
    const userId = decoded.userId;

    const isValid = await UserService.validateRefreshToken(
      userId,
      refresh_token
    );
    if (!isValid) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid refresh token' });
    }

    const access_token = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    const newRefreshToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    return res
      .status(200)
      .json({ access_token, refresh_token: newRefreshToken });
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return res
      .status(500)
      .json({ message: 'An error occurred while refreshing token' });
  }
}
