import {NextApiRequest, NextApiResponse} from "next";
import {ResponseData} from "../../../types/reponse_data";
import clientPromise from "../../../lib/mongodb";

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Récupère tous les films
 *     description: Renvoie une liste de tous les films disponibles dans la base de données.
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
    res: NextApiResponse<ResponseData>) {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const movies = await db.collection("movies")
        .find({})
        .limit(10)
        .toArray();

    res.json({status: 200, data: movies})
}