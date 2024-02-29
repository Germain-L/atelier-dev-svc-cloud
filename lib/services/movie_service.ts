import clientPromise from "../mongodb";
import {Db, ObjectId} from "mongodb";
import {IMovie} from "../../types/interfaces/movie";

export class MovieService {
    private readonly dbPromise: Promise<Db>;

    constructor() {
        // Initialize the database connection when the service is instantiated
        this.dbPromise = this.initializeDb();
    }

    /**
     * Retrieves a single movie by its ID.
     * @param {string} idMovie - The ID of the movie to retrieve.
     * @returns {Promise<IMovie | null>} The movie if found, or null if not found.
     */
    public async getMovie(idMovie: string): Promise<IMovie | null> {
        if (!ObjectId.isValid(idMovie)) {
            throw new Error('Invalid movie ID');
        }

        const db = await this.dbPromise;
        const movie = await db.collection("movies").findOne({_id: new ObjectId(idMovie)});

        return movie ? {
            _id: movie._id,
            title: movie.title,
            year: movie.year,
            genres: movie.genres,
            runtime: movie.runtime,
            cast: movie.cast,
            plot: movie.plot,
            poster: movie.poster
        } : null;
    }

    /**
     * Retrieves a list of movies, limited by the specified amount.
     * @param {number} limit - The maximum number of movies to retrieve.
     * @returns {Promise<IMovie[]>} An array of movies.
     */
    public async getMovies(limit: number): Promise<IMovie[]> {
        const db = await this.dbPromise;
        const movieDocuments = await db.collection("movies").find().limit(limit).toArray();
        return movieDocuments as IMovie[];
    }

    /**
     * Creates a new movie in the database.
     * @param {IMovie} movie - The movie data to create.
     * @returns {Promise<void>}
     */
    public async createMovie(movie: IMovie): Promise<void> {
        const db = await this.dbPromise;
        try {
            await db.collection("movies").insertOne(movie);
        } catch (error) {
            console.error("Failed to create movie:", error);
            // Optionally, rethrow a custom error for the caller to handle
            throw new Error("An error occurred while creating the movie.");
        }
    }

    /**
     * Updates an existing movie in the database.
     * @param {string} idMovie - The ID of the movie to update.
     * @param {IMovie} movie - The new movie data.
     * @returns {Promise<void>}
     */
    public async updateMovie(idMovie: string, movie: IMovie): Promise<void> {
        if (!ObjectId.isValid(idMovie)) {
            throw new Error('Invalid movie ID');
        }

        const db = await this.dbPromise;
        try {
            await db.collection("movies").updateOne({_id: new ObjectId(idMovie)}, {$set: movie});
        } catch (error) {
            console.error("Failed to update movie:", error);
            // Optionally, rethrow a custom error for the caller to handle
            throw new Error("An error occurred while updating the movie.");
        }
    }

    /**
     * Deletes a movie from the database.
     * @param {string} idMovie - The ID of the movie to delete.
     * @returns {Promise<void>}
     */
    public async deleteMovie(idMovie: string): Promise<void> {
        if (!ObjectId.isValid(idMovie)) {
            throw new Error('Invalid movie ID');
        }

        const db = await this.dbPromise;
        try {
            await db.collection("movies").deleteOne({_id: new ObjectId(idMovie)});
        } catch (error) {
            console.error("Failed to delete movie:", error);
            // Optionally, rethrow a custom error for the caller to handle
            throw new Error("An error occurred while deleting the movie.");
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

export default new MovieService();
