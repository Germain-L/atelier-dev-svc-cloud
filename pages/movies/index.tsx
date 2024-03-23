import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IMovie } from '../../types/interfaces/movie';

const MoviesPage = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('access_token'); // Retrieve the token
      const response = await fetch('/api/movies?limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request
        },
      });
      const data = await response.json();
      console.log(data);
      setMovies(data.data);
    };

    fetchMovies();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Movies List</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id?.toString()} className="mb-2">
            <Link href={`/movies/${movie._id}`}>
              <p className="text-blue-500 hover:underline">{movie.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoviesPage;