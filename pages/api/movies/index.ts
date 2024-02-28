import {NextApiRequest, NextApiResponse} from "next";
import {ErrorResponse, SuccessResponse} from "../../../types/responses";
import {IMovie} from "../../../types/interfaces/movie";
import clientPromise from "../../../lib/mongodb";
import movie_service from "../../../lib/services/movie_service";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Récupère tous les films
 *     description: Renvoie une liste de tous les films disponibles dans la base de données.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Limite le nombre de films renvoyés. La valeur par défaut est 10.
 *     responses:
 *       200:
 *         description: Une liste de films.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the movie
 *         title:
 *           type: string
 *           description: Title of the movie
 *         year:
 *           type: integer
 *           format: int64
 *           description: Release year of the movie
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: List of genres the movie belongs to
 *         runtime:
 *           type: integer
 *           format: int32
 *           description: Runtime of the movie in minutes
 *         cast:
 *           type: array
 *           items:
 *             type: string
 *           description: List of main cast members
 *         plot:
 *           type: string
 *           description: Brief summary of the movie plot
 *         poster:
 *           type: string
 *           description: URL to the movie poster image
 *       required:
 *         - _id
 *         - title
 *         - year
 *         - genres
 *         - runtime
 *         - cast
 *         - plot
 *         - poster
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse<IMovie[]> | ErrorResponse>
) {
    if (req.method !== 'GET') {
        // If not, return a 405 Method Not Allowed status code
        // inform the client about allowed methods
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({status: 405, message: 'Method Not Allowed'});
    }

    try {
        // Parse the `limit` parameter, default to 10 if not provided
        const limit = parseInt(req.query.limit as string, 10) || 10;

        // Fetch movies from the database using the movie service
        const movies = await movie_service.getMovies(limit);

        res.status(200).json({status: 200, data: movies});
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        // Providing a null or an empty array for data in case of an error
        // Adjust based on your preference or requirements
        res.status(500).json({status: 500, message: "Failed to fetch movies"});
    }
}
