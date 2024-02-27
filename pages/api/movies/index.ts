import {NextApiRequest, NextApiResponse} from 'next';
import clientPromise from "../../../lib/mongodb";
import {ResponseData} from "../../../types/reponse_data";

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
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: Le titre du film.
 *         year:
 *           type: integer
 *           description: L'année de sortie du film.
 *         director:
 *           type: string
 *           description: Le réalisateur du film.
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Les genres du film.
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