import React, { useEffect, useState } from 'react';
import { useHistory } from '../../contexts/HistoryContext'; // Import the custom hook for context
import './Profile.css';
import { checkCurrentUser } from '../../firebase'; // Import your Firebase function
import { FaUserCircle } from 'react-icons/fa'; // User icon
import spinner_icon from '../../assets/netflix_spinner.gif'; // Loading spinner
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import backArrowIcon from '../../assets/back_arrow_icon.png';
import { useLike } from '../../contexts/LikeContext'; // Import the useLike context

const Profile = () => {
    const { history, removeFromHistory } = useHistory(); // Access the history from context
    const { likedMovies, likeMovie, removeLikedMovie } = useLike(); // Access liked movies and functions from LikeContext
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [movieToRemove, setMovieToRemove] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Check if the user is logged in (using your Firebase function)
        checkCurrentUser(async (user) => {
            if (user) {
                setUserData(user);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });
    }, []);

    // Handle back navigation
    const handleBackClick = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const handleRemoveClick = (movie) => {
        setMovieToRemove(movie);
        setShowPopup(true);
    };

    const handleConfirmRemove = () => {
        if (movieToRemove) {
            removeFromHistory(movieToRemove);
            setShowPopup(false);
        }
    };

    const handleCancelRemove = () => {
        setShowPopup(false);
    };

    const handleCardHover = (movieId) => {
        // Navigate to the player page when the card is clicked
        navigate(`/player/${movieId}`);
    };

    // Handle horizontal scrolling with mouse wheel
    const handleWheel = (e) => {
        if (e.deltaY === 0) return; // Don't handle vertical scroll
        e.preventDefault();
        e.currentTarget.scrollLeft += e.deltaY; // Scroll horizontally based on vertical wheel movement
    };

    // Debugging: log likedMovies to check if state is updated
    useEffect(() => {
        console.log('Liked Movies:', likedMovies);
    }, [likedMovies]);

    return (
        <div className="profile-page">
            {/* Conditionally render back arrow based on the popup state */}
            {!showPopup && (
                <img
                    src={backArrowIcon}
                    alt="Back"
                    className="back-arrow"
                    onClick={handleBackClick} // Trigger navigation when clicked
                />
            )}
            {loading ? (
                <div className="loading-container">
                    <img src={spinner_icon} alt="Loading..." />
                </div>
            ) : (
                <div className="profile-content">
                    <div className="profile-header">
                        <FaUserCircle className="user-icon" /> {/* User Icon */}
                        <h1>{userData ? `Welcome, ${userData.name || 'Guest'}` : "Welcome, Guest"}</h1>
                    </div>

                    {/* History Section */}
                    <div className="history-section">
                        <h2>Your Watch History</h2>
                        {history.length > 0 ? (
                            <div
                                className="history-list"
                                onWheel={handleWheel} // Add wheel event handler for horizontal scrolling
                            >
                                {history.map((movie, index) => (
                                    <div
                                        key={index}
                                        className="history-item"
                                        onClick={() => handleCardHover(movie.id)} // Navigate on click
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                            alt={movie.title}
                                            className="history-thumbnail"
                                        />
                                        <div className="history-overlay">
                                            <FaTimes
                                                className="remove-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent click event on the card
                                                    handleRemoveClick(movie);
                                                }}
                                            />
                                            <p>{movie.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>You haven't watched any trailers yet.</p>
                        )}
                    </div>

                    {/* Liked by You Section */}
                    <div className="liked-by-you-section">
                        <h2>Liked by You</h2>
                        {likedMovies.length > 0 ? (
                            <div className="liked-movies-list">
                                {likedMovies.map((movie) => (
                                    <div key={movie.id} className="liked-movie-item">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                            alt={movie.title}
                                        />
                                        <p>{movie.title}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>You haven't liked any movies yet.</p>
                        )}
                    </div>

                    {/* Your Favourite Section */}
                    <div className="favourite-section">
                        {userData ? (
                            <>
                                <h2>Your Favourites</h2>
                                {/* You can add logic for the favorite content here */}
                            </>
                        ) : (
                            <p>Please login to view your favourite movies.</p>
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation Popup */}
            {showPopup && (
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
        </div>
    );
};

export default Profile;
