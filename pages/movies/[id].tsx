import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IMovie } from '../../types/interfaces/movie';
import { IComment } from '../../types/interfaces/comments';

const MoviePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState<IMovie | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchMovie = async () => {
      const token = localStorage.getItem('access_token'); // Retrieve the token
      const response = await fetch('/api/movie/${id}', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request
        },
      });
      const data = await response.json();
      console.log(data);
      setMovie(data);
    };

    const fetchComments = async () => {
      const token = localStorage.getItem('access_token'); // Retrieve the token
      const response = await fetch(`/api/movies/${id}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the request
        },
      });
      const data = await response.json();
      setComments(data);
    };

    fetchMovie();
    fetchComments();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="text-sm mb-2">Year: {movie.year}</p>
      <p className="mb-4">Plot: {movie.plot}</p>
      <h2 className="text-2xl font-bold mb-2">Comments</h2>
      <ul>
        {Array.isArray(comments) && comments.map((comment) => (
          <li key={comment._id?.toString()} className="mb-2">
            <p className="text-sm"><strong>{comment.name}:</strong> {comment.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MoviePage;