// LikeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState(() => {
    const saved = localStorage.getItem('likedMovies');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
  }, [likedMovies]);

  const likeMovie = (movie) => {
    setLikedMovies((prevLikedMovies) => {
      if (!prevLikedMovies.some((m) => m.id === movie.id)) {
        return [...prevLikedMovies, movie];
      }
      return prevLikedMovies;
    });
  };

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

export const useLike = () => useContext(LikeContext);