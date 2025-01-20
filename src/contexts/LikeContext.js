import React, { createContext, useContext, useState } from 'react';

// Create a context for liked movies
const LikeContext = createContext();

// Create a custom hook to use the context
export const useLike = () => {
    return useContext(LikeContext);
};

// Context provider component
export const LikeProvider = ({ children }) => {
    const [likedMovies, setLikedMovies] = useState([]);

    // Function to like a movie
    const likeMovie = (movie) => {
        setLikedMovies((prevLikedMovies) => {
            // Prevent duplicates
            if (!prevLikedMovies.some((likedMovie) => likedMovie.id === movie.id)) {
                return [...prevLikedMovies, movie];
            }
            return prevLikedMovies;
        });
    };

    // Function to remove a movie from liked list
    const removeLikedMovie = (movieId) => {
        setLikedMovies((prevLikedMovies) =>
            prevLikedMovies.filter((movie) => movie.id !== movieId)
        );
    };

    return (
        <LikeContext.Provider value={{ likedMovies, likeMovie, removeLikedMovie }}>
            {children}
        </LikeContext.Provider>
    );
};
