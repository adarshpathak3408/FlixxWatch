import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const [apiDataSet, setApiDataSet] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    if (cardsRef.current && cardsRef.current.matches(':hover')) {
      if (event.ctrlKey) {
        event.preventDefault(); // Only enable horizontal scroll when Ctrl is pressed
        cardsRef.current.scrollLeft += event.deltaY;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('wheel', handleWheel);

    fetch(
      `https://api.themoviedb.org/3/movie/${category ? category : 'now_playing'}?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setApiDataSet(res.results))
      .catch((err) => console.error(err));

    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : 'Now Playing'}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiDataSet.map((card, index) => {
          return (
            <Link to={`/player/${card.id}`} className="card" key={index}>
              <img src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} alt="" />
              <p>{card.original_title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;
