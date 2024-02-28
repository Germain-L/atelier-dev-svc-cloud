import clientPromise from "../mongodb";
import {Db, ObjectId} from "mongodb";
import {IMovie} from "../../types/interfaces/movie";

class MovieService {
    private readonly dbPromise: Promise<Db>;

    constructor() {
        // Initialize the database connection when the service is instantiated
        this.dbPromise = this.initializeDb();
    }

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

    public async getMovies(limit: number): Promise<IMovie[]> {
        const db = await this.dbPromise;
        const movieDocuments = await db.collection("movies").find().limit(limit).toArray();
        return movieDocuments as IMovie[];
    }

    public async createMovie(movie: IMovie): Promise<void> {
        const db = await this.dbPromise;
        const result = await db.collection("movies").insertOne(movie);
    }

    private async initializeDb(): Promise<Db> {
        const client = await clientPromise;
        return client.db("sample_mflix");
    }
}

export default new MovieService();
