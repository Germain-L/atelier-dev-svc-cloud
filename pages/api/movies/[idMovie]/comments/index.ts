import {NextApiRequest, NextApiResponse} from "next";
import {ResponseData} from "../../../../../types/reponse_data";

/**
 * @swagger
 * /api/movie/comments:
 *   get:
 *     summary: Récupère tous les commentaires pour un film
 *     description: Renvoie une liste de tous les commentaires liés à un film spécifique.
 *     parameters:
 *       - in: query
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID du film pour lequel récupérer les commentaires.
 *     responses:
 *       200:
 *         description: Une liste de commentaires pour le film.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *         - movieId
 *       properties:
 *         text:
 *           type: string
 *           description: Le contenu du commentaire.
 *         movieId:
 *           type: string
 *           description: L'ID du film associé au commentaire.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    switch (req.method) {
        case 'GET':
            res.status(501).end();
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
