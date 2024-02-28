import {IMovie} from "../../types/interfaces/movie";
import clientPromise from "../../lib/mongodb";

export async function getMovies(limit: number = 10): Promise<IMovie[]> {
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    const moviesCollection = await db.collection("movies")
        .find({})
        .limit(limit)
        .toArray();

    return moviesCollection.map(movie => ({
        _id: movie._id.toString(), // Convert ObjectId to string
        title: movie.title,
        year: movie.year,
        genres: movie.genres,
        runtime: movie.runtime,
        cast: movie.cast,
        plot: movie.plot,
        poster: movie.poster
    }));
}
