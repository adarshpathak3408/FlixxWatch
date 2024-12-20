import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const HistoryContext = createContext();

// Custom hook to use the history context
export const useHistory = () => useContext(HistoryContext);

// HistoryProvider to provide context to the app
export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage on component mount
    const storedHistory = JSON.parse(localStorage.getItem('trailerHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const addToHistory = (movie) => {
    // Check if the movie is already in history to prevent duplicates
    const movieExists = history.some((item) => item.id === movie.id);
    if (!movieExists) {
      // Prepend the new movie to the beginning of the array (latest to oldest)
      const newHistory = [movie, ...history];
      setHistory(newHistory);
      localStorage.setItem('trailerHistory', JSON.stringify(newHistory));
    }
  };

  const removeFromHistory = (movieToRemove) => {
    // Remove movie from history and update localStorage
    const newHistory = history.filter(movie => movie.id !== movieToRemove.id);
    setHistory(newHistory);
    localStorage.setItem('trailerHistory', JSON.stringify(newHistory));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
