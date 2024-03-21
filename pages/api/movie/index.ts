import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse, SuccessResponse } from '../../../types/responses';
import { IMovie } from '../../../types/interfaces/movie';
import MovieService from '../../../lib/services/MovieService';
import { authenticate } from '../../../lib/authMiddleware';

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: The movies managing API
 * /api/movie:
 *   post:
 *     summary: Creates a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Bearer token is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       405:
 *         description: Method Not Allowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export default authenticate(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<IMovie> | ErrorResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }

  try {
    const movie: IMovie = req.body;
    const createdMovie = await MovieService.createMovie(movie);
    return res.status(201).json({
      status: 201,
      data: createdMovie,
      message: 'Movie created successfully',
    });
  } catch (error) {
    console.error('Failed to create the movie:', error);
    return res
      .status(500)
      .json({ status: 500, message: 'Failed to create the movie' });
  }
});