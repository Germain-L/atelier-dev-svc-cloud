import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import {ResponseData} from "../../../types/reponse_data";

/**
 * @swagger
 * /api/movie/{idMovie}:
 *   get:
 *     summary: Retrieve a single movie by its ID
 *     description: Fetches a single movie document from the MongoDB collection by its ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         description: MongoDB ObjectId of the movie to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single movie object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Server error
 */
async function getMovie(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    try {
        const { idMovie } = req.query;
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const movie = await db.collection("movies").findOne({ _id: new ObjectId(idMovie as string) });

        if (!movie) {
            return res.status(404).json({ status: 404, data: "Movie not found" });
        }

        res.status(200).json({ status: 200, data: movie });
    } catch ({ message }) {
        res.status(500).json({ status: 500, data: message });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    switch (req.method) {
        case 'GET':
            await getMovie(req, res);
            break;
        case 'POST':
            // Implement POST logic or return 501 Not Implemented
            res.status(501).end();
            break;
        case 'PUT':
            // Implement PUT logic or return 501 Not Implemented
            res.status(501).end();
            break;
        case 'DELETE':
            // Implement DELETE logic or return 501 Not Implemented
            res.status(501).end();
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
