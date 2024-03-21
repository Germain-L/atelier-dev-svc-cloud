import { NextApiRequest, NextApiResponse } from 'next';
import { ErrorResponse, SuccessResponse } from '../../../../../types/responses';
import { IComment } from '../../../../../types/interfaces/comments';
import CommentService from '../../../../../lib/services/CommentService';
import { ObjectId } from 'mongodb';

/**
 * @swagger
 * paths:
 *   /api/movies/{idMovie}/comments/{idComment}:
 *     get:
 *       summary: Retrieves a specific comment for a movie
 *       tags:
 *         - Comments
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the movie to retrieve the comment for
 *         - in: path
 *           name: idComment
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the comment to retrieve
 *       responses:
 *         200:
 *           description: Comment retrieved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         404:
 *           description: Comment not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         500:
 *           description: Failed to retrieve comment
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *     put:
 *       summary: Updates an existing comment for a movie
 *       tags:
 *         - Comments
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the movie to update the comment for
 *         - in: path
 *           name: idComment
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the comment to update
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentInput'
 *       responses:
 *         200:
 *           description: Comment updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Comment'
 *         400:
 *           description: Invalid input data
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         404:
 *           description: Comment not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         500:
 *           description: Failed to update comment
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *     delete:
 *       summary: Deletes a comment for a movie
 *       tags:
 *         - Comments
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: idMovie
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the movie to delete the comment from
 *         - in: path
 *           name: idComment
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the comment to delete
 *       responses:
 *         200:
 *           description: Comment deleted successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SuccessResponse'
 *         404:
 *           description: Comment not found
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 *         500:
 *           description: Failed to delete comment
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Error'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse<IComment> | ErrorResponse>
) {
  let { idMovie, idComment } = req.query;
  idMovie = idMovie as string;
  idComment = idComment as string;

  if (!ObjectId.isValid(idMovie as string) || !ObjectId.isValid(idComment)) {
    return res
      .status(400)
      .json({ status: 400, message: 'Invalid movie or comment ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const comment = await CommentService.getCommentByIds(idMovie as string);
        if (!comment) {
          return res
            .status(404)
            .json({ status: 404, message: 'Comment not found' });
        }
        return res
          .status(200)
          .json({
            status: 200,
            data: comment,
            message: 'Comment retrieved successfully',
          });
      } catch (error) {
        console.error('Failed to retrieve comment:', error);
        return res
          .status(500)
          .json({ status: 500, message: 'Failed to retrieve comment' });
      }

    case 'PUT':
      try {
        if (!req.body) {
          return res
            .status(400)
            .json({ status: 400, message: 'Comment data is required' });
        }
        const commentUpdate = req.body as Partial<IComment>;
        const updatedComment = await CommentService.updateComment(
          idComment as string,
          commentUpdate
        );
        if (!updatedComment) {
          return res
            .status(404)
            .json({ status: 404, message: 'Comment not found' });
        }
        return res.status(200).json({
          status: 200,
          data: updatedComment,
          message: 'Comment updated successfully',
        });
      } catch (error) {
        console.error('Failed to update comment:', error);
        return res
          .status(500)
          .json({ status: 500, message: 'Failed to update comment' });
      }

    case 'DELETE':
      try {
        await CommentService.deleteComment(idComment as string);
        return res
          .status(200)
          .json({ status: 200, message: 'Comment deleted successfully' });
      } catch (error) {
        console.error('Failed to delete comment:', error);
        return res
          .status(500)
          .json({ status: 500, message: 'Failed to delete comment' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res
        .status(405)
        .json({ status: 405, message: 'Method Not Allowed' });
  }
}
