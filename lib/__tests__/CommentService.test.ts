import clientPromise from "../mongodb";
import {CommentService} from "../services/CommentService";
import {Db, ObjectId} from "mongodb";

// Mock the MongoDB client
jest.mock('../mongodb', () => ({
    __esModule: true,
    default: jest.fn(),
}));

const mockFind = jest.fn();
const mockInsertOne = jest.fn();
const mockUpdateOne = jest.fn();
const mockDeleteOne = jest.fn();

jest.mock('mongodb', () => {
    const actualMongoDB = jest.requireActual('mongodb');
    return {
        ...actualMongoDB,
        MongoClient: jest.fn().mockImplementation(() => ({
            db: jest.fn().mockImplementation(() => ({
                collection: jest.fn().mockReturnValue({
                    find: mockFind,
                    insertOne: mockInsertOne,
                    updateOne: mockUpdateOne,
                    deleteOne: mockDeleteOne,
                    findOne: jest.fn(), // Add more mocked methods as needed
                }),
            })),
        })),
    };
});

describe('CommentService', () => {
    let db: Db;
    let commentService: CommentService;

    beforeAll(async () => {
        db = await (await clientPromise).db('sample_mflix');
        commentService = new CommentService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new comment', async () => {
        const newComment = {
            movie_id: new ObjectId(),
            name: 'John Doe',
            email: 'john@example.com',
            text: 'This is a test comment.',
            date: new Date(),
        };

        mockInsertOne.mockResolvedValue({ acknowledged: true, insertedId: new ObjectId() });

        await expect(commentService.createComment(newComment)).resolves.not.toThrow();
        expect(mockInsertOne).toHaveBeenCalledWith(newComment);
    });

    it('should retrieve comments for a specific movie', async () => {
        const movieId = new ObjectId();
        const mockComments = [
            { _id: new ObjectId(), movie_id: movieId, text: 'Comment 1', date: new Date() },
            { _id: new ObjectId(), movie_id: movieId, text: 'Comment 2', date: new Date() },
        ];

        mockFind.mockReturnThis();
        mockFind.mockReturnValue({
            toArray: jest.fn().mockResolvedValue(mockComments),
        });

        const comments = await commentService.getCommentsByMovieId(movieId.toHexString());
        expect(comments).toEqual(mockComments);
        expect(mockFind).toHaveBeenCalledWith({ movie_id: movieId });
    });

    it('should update a comment', async () => {
        const commentId = new ObjectId();
        const update = { text: 'Updated comment text.' };

        mockUpdateOne.mockResolvedValue({ acknowledged: true, modifiedCount: 1 });

        await expect(commentService.updateComment(commentId.toHexString(), update)).resolves.not.toThrow();
        expect(mockUpdateOne).toHaveBeenCalledWith({ _id: commentId }, { $set: update });
    });

    it('should delete a comment', async () => {
        const commentId = new ObjectId();

        mockDeleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

        await expect(commentService.deleteComment(commentId.toHexString())).resolves.not.toThrow();
        expect(mockDeleteOne).toHaveBeenCalledWith({ _id: commentId });
    });
});
