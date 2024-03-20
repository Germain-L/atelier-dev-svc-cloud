import clientPromise from "../mongodb";
import { Db, ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';
import {IUser} from "../../types/interfaces/users";


export class UserService {
    private readonly dbPromise: Promise<Db>;

    constructor() {
        this.dbPromise = this.initializeDb();
    }

    /**
     * Creates a new user in the database.
     * @param {IUser} user - The user data to create.
     * @returns {Promise<IUser>} The created user.
     */
    public async createUser(user: IUser): Promise<IUser> {
        const db = await this.dbPromise;

        // Hash the user's password before storing it
        const hashedPassword = await bcrypt.hash(user.password, 12);

        const newUser = {
            ...user,
            password: hashedPassword,
        };

        try {
            const result = await db.collection("users").insertOne(newUser);
            const createdUser = await this.getUserById(result.insertedId);

            if (!createdUser) {
                throw new Error("Failed to create user.");
            }

            return createdUser;
        } catch (error) {
            console.error("Failed to create user:", error);
            throw new Error("An error occurred while creating the user.");
        }
    }

    /**
     * Finds a user by their email.
     * @param {string} email - The email of the user to find.
     * @returns {Promise<IUser | null>} The user if found, or null if not found.
     */
    public async getUserByEmail(email: string): Promise<IUser | null> {
        const db = await this.dbPromise;
        const user = await db.collection("users").findOne({ email });

        if (!user) {
            return null;
        }

        return user as unknown as IUser;
    }

    /**
     * Retrieves a user by their ID.
     * @param {ObjectId} id - The ID of the user to retrieve.
     * @returns {Promise<IUser | null>} The user if found, or null if not found.
     */
    public async getUserById(id: ObjectId): Promise<IUser | null> {
        const db = await this.dbPromise;
        const user = await db.collection("users").findOne({ _id: id });

        if (!user) {
            return null;
        }

        return user as unknown as IUser;
    }

    /**
     * Initializes the database connection.
     * @private
     * @returns {Promise<Db>} The database connection.
     */
    private async initializeDb(): Promise<Db> {
        const client = await clientPromise;
        return client.db("yourDatabaseName"); // Replace "yourDatabaseName" with your actual database name
    }
}

export default new UserService();
