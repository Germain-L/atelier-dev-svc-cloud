import clientPromise from "../mongodb";
import {Db, ObjectId} from "mongodb";
import {IComment} from "../../types/interfaces/comments";

export class CommentService {
    private readonly dbPromise: Promise<Db>;

    constructor() {
        this.dbPromise = this.initializeDb();
    }

    /**
     * Retrieves comments for a specific movie.
     * @param {string} idMovie - The ID of the movie to retrieve comments for.
     * @returns {Promise<IComment[]>} An array of comments for the movie.
     */
    public async getCommentsByMovieId(idMovie: string): Promise<IComment[] | null> {
        if (!ObjectId.isValid(idMovie)) {
            throw new Error('Invalid movie ID');
        }

        const db = await this.dbPromise;
        const comments = await db.collection("comments").find({movie_id: new ObjectId(idMovie)}).toArray();
        return comments as IComment[];
    }


    /**
     * Creates a new comment in the database.
     * @param {IComment} comment - The comment data to create.
     * @returns {Promise<void>}
     */
    public async createComment(comment: IComment): Promise<void> {
        const db = await this.dbPromise;
        try {
            await db.collection("comments").insertOne(comment);
        } catch (error) {
            console.error("Failed to create comment:", error);
            throw new Error("An error occurred while creating the comment.");
        }
    }

    /**
     * Updates an existing comment in the database.
     * @param {string} commentId - The ID of the comment to update.
     * @param {Partial<IComment>} commentUpdate - The comment data to update.
     * @returns {Promise<void>}
     */
    public async updateComment(commentId: string, commentUpdate: Partial<IComment>): Promise<void> {
        if (!ObjectId.isValid(commentId)) {
            throw new Error('Invalid comment ID');
        }

        const db = await this.dbPromise;
        try {
            await db.collection("comments").updateOne({_id: new ObjectId(commentId)}, {$set: commentUpdate});
        } catch (error) {
            console.error("Failed to update comment:", error);
            throw new Error("An error occurred while updating the comment.");
        }
    }

    /**
     * Deletes a comment from the database.
     * @param {string} commentId - The ID of the comment to delete.
     * @returns {Promise<void>}
     */
    public async deleteComment(commentId: string): Promise<void> {
        if (!ObjectId.isValid(commentId)) {
            throw new Error('Invalid comment ID');
        }

        const db = await this.dbPromise;
        try {
            await db.collection("comments").deleteOne({_id: new ObjectId(commentId)});
        } catch (error) {
            console.error("Failed to delete comment:", error);
            throw new Error("An error occurred while deleting the comment.");
        }
    }

    /**
     * Initializes the database connection.
     * @private
     * @returns {Promise<Db>} The database connection.
     */
    private async initializeDb(): Promise<Db> {
        const client = await clientPromise;
        return client.db("sample_mflix");
    }
}

export default new CommentService();
