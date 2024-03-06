import {NextApiRequest, NextApiResponse} from "next";
import {ErrorResponse, SuccessResponse} from "../../../types/responses";
import {IMovie} from "../../../types/interfaces/movie";
import {ObjectId} from "mongodb";
import movie_service from "../../../lib/services/MovieService";

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: The movies managing API
 *
 * /api/movie:
 *   post:
 *     summary: Creates a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       500:
 *         description: Failed to create the movie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * /api/movie/{idMovie}:
 *   get:
 *     summary: Gets a movie by ID
 *     tags: [Movies]
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
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse<IMovie> | ErrorResponse>) {

    const allowedMethods = ['GET', 'PUT', 'DELETE', 'POST'];

    if (!allowedMethods.includes(req.method as string)) {
        res.setHeader('Allow', allowedMethods);
        return res.status(405).json({status: 405, message: 'Method Not Allowed'});
    }

    // If the request method is POST, create a new movie, end the request, and return the response
    if (req.method === 'POST') {
        const movie = req.body as IMovie;
        try {
            await movie_service.createMovie(movie);
            res.status(201).json({status: 201, message: 'Movie created successfully'});
            return res.end();
        } catch (error) {
            console.error("Failed to create the movie:", error);
            res.status(500).json({status: 500, message: "Failed to create the movie"});
            return res.end();
        }
    }

    // Other methods require the `idMovie` query parameter
    const idMovie = req.query.idMovie as string || '';
    if (!idMovie) {
        return res.status(400).json({status: 400, message: 'Movie ID is required'});
    }

    switch (req.method) {
        case 'GET':
            try {
                // Ensure the id is a valid ObjectId
                if (!ObjectId.isValid(idMovie as string)) {
                    return res.status(400).json({status: 400, message: 'Invalid movie ID'});
                }

                const movie = await movie_service.getMovie(idMovie as string);

                if (!movie) {
                    return res.status(404).json({status: 404, message: 'Movie not found'});
                }

                res.status(200).json({status: 200, data: movie});
                return res.end();
            } catch (error) {
                console.error("Failed to fetch the movie:", error);
                res.status(500).json({status: 500, message: "Failed to fetch the movie"});
                return res.end();
            }
        case 'PUT':
            const updatedMovie = req.body as IMovie;
            try {
                await movie_service.updateMovie(idMovie, updatedMovie);
                res.status(200).json({status: 200, message: 'Movie updated successfully'});
                return res.end();
            } catch (error) {
                console.error("Failed to update the movie:", error);
                res.status(500).json({status: 500, message: "Failed to update the movie"});
                return res.end();
            }
        case 'DELETE':
            try {
                await movie_service.deleteMovie(idMovie);
                res.status(200).json({status: 200, message: 'Movie deleted successfully'});
                return res.end();
            } catch (error) {
                console.error("Failed to delete the movie:", error);
                res.status(500).json({status: 500, message: "Failed to delete the movie"});
                return res.end();
            }
    }
}
