export interface IMovie {
    _id: string;
    title: string;
    year: number;
    genres: string[];
    runtime: number;
    cast: string[];
    plot: string;
    poster: string;
}