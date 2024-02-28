import {NextApiRequest, NextApiResponse} from "next";
import {ErrorResponse, SuccessResponse} from "../../../types/responses";
import {IMovie} from "../../../types/interfaces/movie";
import {ObjectId} from "mongodb";
import movie_service from "../../../lib/services/movie_service";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse<IMovie> | ErrorResponse>) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({status: 405, message: 'Method Not Allowed'});
    }

    const {idMovie} = req.query;

    try {
        // Ensure the id is a valid ObjectId
        if (!ObjectId.isValid(idMovie as string)) {
            return res.status(400).json({status: 400, message: 'Invalid movie ID'});
        }

        const movie = await movie_service.getMovie(idMovie as string);

        if (!movie) {
            return res.status(404).json({status: 404, message: 'Movie not found'});
        }

        const movieData: IMovie = {
            _id: movie._id.toString(), // Convert ObjectId to string
            title: movie.title,
            year: movie.year,
            genres: movie.genres,
            runtime: movie.runtime,
            cast: movie.cast,
            plot: movie.plot,
            poster: movie.poster
        };

        res.status(200).json({status: 200, data: movieData});
    } catch (error) {
        console.error("Failed to fetch the movie:", error);
        res.status(500).json({status: 500, message: "Failed to fetch the movie"});
    }
}
