import {NextApiRequest, NextApiResponse} from "next";
import {ErrorResponse, SuccessResponse} from "../../../../../types/responses";
import {IComment} from "../../../../../types/interfaces/comments";
import CommentService from "../../../../../lib/services/CommentService";


/**
 * @swagger
 * paths:
 *   /api/movies/{idMovie}/comments:
 *     get:
 *       summary: Retrieves comments for a specific movie
 *       tags:
 *         - Comments
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the movie to retrieve comments for
 *       responses:
 *         200:
 *           description: An array of comments for the movie
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Comment'
 *         404:
 *           description: Comments not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         500:
 *           description: Failed to retrieve comments
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *           description: The unique identifier for the comment
 *         name:
 *           type: string
 *           description: The name of the commenter
 *         email:
 *           type: string
 *           description: The email of the commenter
 *         movie_id:
 *           type: string
 *           format: objectId
 *           description: The ID of the movie the comment is related to
 *         text:
 *           type: string
 *           description: The text of the comment
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date when the comment was posted
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
    res: NextApiResponse<SuccessResponse<IComment[]> | ErrorResponse>
) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({status: 405, message: 'Method Not Allowed'});
    }

    const {idMovie} = req.query;

    try {
        const comments = await CommentService.getCommentsByMovieId(idMovie as string);
        if (!comments) {
            return res.status(404).json({status: 404, message: 'Comments not found'});
        }
        return res.status(200).json({status: 200, data: comments, message: 'Comments retrieved successfully'});
    } catch (error) {
        console.error("Failed to retrieve comments:", error);
        return res.status(500).json({status: 500, message: "Failed to retrieve comments"});
    }
}