import React, { useState, useEffect } from 'react';
import './CheckReviews.css';

const CheckReviews = ({ movieId }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`             
          },
        };

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=1`,
          options
        );
        const data = await response.json();
        setReviews(data.results || []);
      } catch (err) {
        setError('Failed to fetch reviews. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="reviews-container">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h4>{review.author_details.name || review.author}</h4>
            <p>
              {review.content.length > 300
                ? `${review.content.substring(0, 300)}...`
                : review.content}
            </p>
            <p className="review-rating">
              Rating: {review.author_details.rating || 'N/A'}
            </p>
          </div>
        ))
      ) : (
        <p>No reviews available for this movie.</p>
      )}
    </div>
  );
};

export default CheckReviews;
