import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse, SuccessResponse } from '../../../types/responses';
import { IMovie } from '../../../types/interfaces/movie';
import { ObjectId } from 'mongodb';
import MovieService from '../../../lib/services/MovieService';
import { authenticate } from '../../../lib/authMiddleware';

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: The movies managing API
 *
 * /api/movie/{idMovie}:
 *   get:
 *     summary: Gets a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie id
 *     responses:
 *       200:
 *         description: A movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         $ref: '#/components/responses/MovieNotFound'
 *       500:
 *         description: Failed to fetch the movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     summary: Updates a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       404:
 *         $ref: '#/components/responses/MovieNotFound'
 *       500:
 *         description: Failed to update the movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Deletes a movie by ID
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: The movie id
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       404:
 *         $ref: '#/components/responses/MovieNotFound'
 *       500:
 *         description: Failed to delete the movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   responses:
 *     MovieNotFound:
 *       description: Movie not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: integer
 *           description: The HTTP status code
 *         message:
 *           type: string
 *           description: The error message
 */
export default authenticate(async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<IMovie> | ErrorResponse>,
) {
  const allowedMethods = ['GET', 'PUT', 'DELETE'];
  const { idMovie } = req.query;

  if (!allowedMethods.includes(req.method as string)) {
    res.setHeader('Allow', allowedMethods);
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }

  if (!idMovie || Array.isArray(idMovie) || !ObjectId.isValid(idMovie)) {
    return res.status(400).json({ status: 400, message: 'Invalid movie ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const movie = await MovieService.getMovie(idMovie);
        if (!movie) {
          return res
            .status(404)
            .json({ status: 404, message: 'Movie not found' });
        }
        return res.status(200).json({ status: 200, data: movie });

      case 'PUT':
        const updatedMovie: IMovie = req.body;
        await MovieService.updateMovie(idMovie, updatedMovie);
        return res
          .status(200)
          .json({ status: 200, message: 'Movie updated successfully' });

      case 'DELETE':
        await MovieService.deleteMovie(idMovie);
        return res
          .status(200)
          .json({ status: 200, message: 'Movie deleted successfully' });

      default:
        // This case is now technically unnecessary due to the initial method check
        return res
          .status(405)
          .json({ status: 405, message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res
      .status(500)
      .json({ status: 500, message: 'Internal Server Error' });
  }
});