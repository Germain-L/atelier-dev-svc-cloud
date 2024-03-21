import clientPromise from '../mongodb';
import { Db, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { IUser } from '../../types/interfaces/users';

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
      const result = await db.collection('users').insertOne(newUser);
      const createdUser = await this.getUserById(result.insertedId);

      if (!createdUser) {
        throw new Error('Failed to create user.');
      }

      return createdUser;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('An error occurred while creating the user.');
    }
  }

  /**
   * Finds a user by their email.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<IUser | null>} The user if found, or null if not found.
   */
  public async getUserByEmail(email: string): Promise<IUser | null> {
    const db = await this.dbPromise;
    const user = await db.collection('users').findOne({ email });

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
    const user = await db.collection('users').findOne({ _id: id });

    if (!user) {
      return null;
    }

    return user as unknown as IUser;
  }

  /**
   * Stores a refresh token for the user.
   * @param {ObjectId} _id - The ID of the user.
   * @param {string} refresh_token - The refresh token to store.
   */
  async storeRefreshToken(_id: ObjectId | undefined, refresh_token: string) {
    const db = await this.dbPromise;
    try {
      await db
        .collection('users')
        .updateOne({ _id }, { $set: { refresh_token } });
    } catch (error) {
      console.error('Failed to store refresh token:', error);
      throw new Error('An error occurred while storing the refresh token.');
    }
  }

  /**
   * Validates the provided refresh token against the one stored in the database.
   * @param userId The ID of the user whose refresh token is to be validated.
   * @param refresh_token The refresh token to validate.
   * @returns {Promise<boolean>} True if the token is valid, false otherwise.
   */
  public async validateRefreshToken(
    userId: ObjectId,
    refresh_token: string
  ): Promise<boolean> {
    const db = await this.dbPromise;
    try {
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(userId) });

      if (!user) {
        return false;
      }

      return user.refresh_token.toString() === refresh_token.toString();
    } catch (error) {
      console.error('Failed to validate refresh token:', error);
      throw new Error('An error occurred while validating the refresh token.');
    }
  }

  /**
   * Initializes the database connection.
   * @private
   * @returns {Promise<Db>} The database connection.
   */
  private async initializeDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db('yourDatabaseName'); // Replace "yourDatabaseName" with your actual database name
  }
}

export default new UserService();
