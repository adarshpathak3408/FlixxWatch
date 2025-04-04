import React, { useState, useEffect } from 'react';
import { useHistory } from '../../contexts/HistoryContext';
import { IoClose } from "react-icons/io5";
import './Player.css';
import { useParams, useNavigate } from 'react-router-dom';
import backArrowIcon from '../../assets/back_arrow_icon.png';
import spinner_icon from '../../assets/netflix_spinner.gif';
import CheckReviews from '../../components/CheckReviews/CheckReviews';
import { useLike } from '../../contexts/LikeContext';
import GroupWatchModal from '../../components/GroupModal/GroupWatchModal';
import { auth } from '../../firebase';

const Player = () => {
  const { id } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [movieToRemove, setMovieToRemove] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showGroupWatch, setShowGroupWatch] = useState(false);
  const [userId, setUserId] = useState('');

  const { addToHistory, removeFromHistory } = useHistory();
  const navigate = useNavigate();
  const { likedMovies, likeMovie, removeLikedMovie } = useLike();
  const [isLiked, setIsLiked] = useState(false);

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId('');
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`      
      }
    };

    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then(res => res.json())
      .then(data => setMovieDetails(data))
      .catch(err => console.error(err));

    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(res => res.json())
      .then(data => {
        const trailerData = data.results.find(video => video.type === "Trailer");
        setTrailer(trailerData || null);
      })
      .catch(err => console.error(err));

    setIsLiked(likedMovies.some(movie => movie.id === parseInt(id)));
  }, [likedMovies, id, API_KEY]);

  const handleLikeClick = () => {
    if (isLiked) {
      removeLikedMovie(parseInt(id));
    } else {
      likeMovie({
        id: parseInt(id),
        title: movieDetails.original_title,
        poster: movieDetails.poster_path
      });
    }
    setIsLiked(!isLiked);
  };

  if (!movieDetails) {
    return (
      <div className="loading-spinner-container">
        <img src={spinner_icon} alt="Loading..." className="loading-spinner" />
      </div>
    );
  }

  const { backdrop_path, poster_path, original_title, release_date, vote_average, vote_count, overview } = movieDetails;

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      addToHistory({
        id: movieDetails.id,
        title: movieDetails.original_title,
        poster: movieDetails.poster_path
      });
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleRemoveClick = (movie) => {
    setMovieToRemove(movie);
    setIsPopupOpen(true);
  };

  const handleConfirmRemove = () => {
    if (movieToRemove) {
      removeFromHistory(movieToRemove.id);
    }
    setIsPopupOpen(false);
  };

  const handleCancelRemove = () => {
    setIsPopupOpen(false);
  };

  const handleGroupWatch = () => {
    if (!userId) {
      alert('Please sign in to start a group watch');
      return;
    }
    setShowGroupWatch(true);
  };

  return (
    <div className="player">
      <img
        src={backArrowIcon}
        alt="Back"
        className={`back-arrow ${isModalOpen ? 'hidden' : ''}`}
        onClick={handleBackClick}
      />

      <div className="movie-details">
        <img
          src={`https://image.tmdb.org/t/p/w500${backdrop_path || poster_path}`}
          alt={original_title}
          className="movie-thumbnail"
        />
        <h1 className="movie-title">{original_title}</h1>
        <p className="movie-release-year">Release Year: {new Date(release_date).getFullYear()}</p>
        <p className="movie-rating">
          Rating: {vote_average} / 10 ({vote_count} votes)
        </p>
        <p className="movie-description">{overview}</p>
        <button className="watch-trailer" onClick={toggleModal}>
          Watch Trailer
        </button>
        <div className="movie-options">
          <button onClick={toggleFavorite}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
          <button>Share</button>
          <button>Rate Movie</button>
          <button onClick={() => setShowReviews(!showReviews)}>
            {showReviews ? 'Hide Reviews' : 'Check Reviews'}
          </button>
        </div>
      </div>

      {isModalOpen && trailer && (
        <div className="modal">
          <div className="modal-content">
            <IoClose className="close-btn" onClick={toggleModal} />
            <h2 className="modal-title">{original_title} - Trailer</h2>
            <iframe
              width="100%"
              height="450px"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${original_title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="modal-actions">
              <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}>
                {isLiked ? '❤️ Liked' : '🤍 Like'}
              </button>
              <button className="watch-later-button">
                ⏰ Watch Later
              </button>
              <button className="group-watch-button" onClick={handleGroupWatch}>
                👥 Group Watch
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Are you sure you want to remove this movie from History?</h3>
            <div className="popup-actions">
              <button className="popup-button" onClick={handleConfirmRemove}>Yes</button>
              <button className="popup-button" onClick={handleCancelRemove}>No</button>
            </div>
          </div>
        </div>
      )}

      {showReviews && (
        <div className="reviews-overlay">
          <div className="reviews-content">
            <h2>Reviews for {original_title}</h2>
            <IoClose className="close-btn" onClick={() => setShowReviews(false)} />
            <CheckReviews movieId={id} />
          </div>
        </div>
      )}

      {showGroupWatch && trailer && (
        <GroupWatchModal
          movie={{
            id,
            title: original_title,
            trailerKey: trailer.key
          }}
          onClose={() => setShowGroupWatch(false)}
          userId={userId}
        />
      )}
    </div>
  );
};

export default Player;