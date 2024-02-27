import {NextApiRequest, NextApiResponse} from "next";
import {ResponseData} from "../../../../../types/reponse_data";

/**
 * @swagger
 * /api/movie/comment/{idComment}:
 *   get:
 *     summary: Récupère un commentaire par son ID
 *     description: Renvoie les détails d'un commentaire spécifique par son ID.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails d'un commentaire.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *   post:
 *     summary: Ajoute un nouveau commentaire pour un film
 *     description: Ajoute un nouveau commentaire à un film spécifique.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Commentaire ajouté.
 *   put:
 *     summary: Met à jour un commentaire
 *     description: Met à jour les informations d'un commentaire existant par son ID.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Commentaire mis à jour.
 *   delete:
 *     summary: Supprime un commentaire
 *     description: Supprime un commentaire de la base de données par son ID.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Commentaire supprimé.
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
