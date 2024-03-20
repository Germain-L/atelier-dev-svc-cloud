// authMiddleware.ts
import {NextApiRequest, NextApiResponse} from 'next';
import jwt from 'jsonwebtoken';

export const authenticate = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const secretString = process.env.JWT_SECRET as string;
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({message: 'Unauthorized: Token missing'});
        }

        try {
            jwt.verify(token, secretString);
            return handler(req, res);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({message: 'Unauthorized: Token expired'});
            } else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({message: 'Unauthorized: Invalid token'});
            } else {
                console.error('JWT verification error:', error);
                return res.status(500).json({message: 'Internal server error'});
            }
        }
    };
};
