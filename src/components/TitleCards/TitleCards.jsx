import React, { useEffect, useRef, useState } from 'react'
import './TitleCards.css'
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {

  // This defines the API request details like method, headers, and authorization token. It is static and reused for all the API calls, so we define it outside to avoid repeating it.
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjAwNmU2OTFkNzA5MDNjMGIzOTkxZDc5YzIwYjdlZSIsIm5iZiI6MTczMjUyMDA2OC4wNDc2MDQ4LCJzdWIiOiI2NzQ0Mjc1NjRkNTBjY2Q3ZGE0OGM4ZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.vO82z1WpegCe7fCY0cfRf-3gpJdBlMBReDb8yzTBPvo'
    }
  };

  // we are using useState here to store and manage the data fetched from the API.
  const [apiDataSet, setApiDataSet] = useState([]);

  // Using useRef() to create a reference to the 'card-list' div for direct DOM access without re rendering.
  const cardsRef = useRef();

  // handleWheel function prevents default vertical scroll and instead moves the scroll position horizontally that is (left to right).
  const handleWheel = (event) => {

    event.preventDefault(); // it stops the behaviour of vertical scrolling i.e. top to bottom or bottom to top
    cardsRef.current.scrollLeft += event.deltaY; // it adds the new behaviour of horizontal scrolling i.e left to right or right to left

  }

  // useEffect adds the 'wheel' event listener to the 'card-list' div, triggering handleWheel function when the mouse wheel is used.
  useEffect(() => {
    cardsRef.current.addEventListener('wheel', handleWheel);

    // The API call to fetch data happens here inside useEffect. This ensures the data is fetched only once when the component loads, avoiding repeated calls on every render.
    fetch(`https://api.themoviedb.org/3/movie/${category ? category : "now_playing"}?language=en-US&page=1`, options)
      .then(res => res.json())

      // we have used setApiDataSet here beacuse it updates the state with API data so that it can display it and refresh the UI.
      .then(res => setApiDataSet(res.results))
      .catch(err => console.error(err));
  }, [])


  return (
    <div className='title-cards'>
      {/* if title is passed as props then it will be displayed, otherwise it will display "Popular On Netflix" */}
      <h2>{title ? title : "Now Playing"}</h2>

      <div className="card-list" ref={cardsRef}>

        {/* map() method loops through the apiDataSet. here 'card' represents the current element (like data for each card), and 'index' is the position of that element in the array (its a unique key for each card). */}
        {apiDataSet.map((card, index) => {

          // Using Link for navigation, clicking on a card will take the user to a new page without reloading the site
          return <Link to={`/player/${card.id}`} className="card" key={index}>

            {/* we are using card here because we are accessing each data from apiDataSet array */}
            <img src={`https://image.tmdb.org/t/p/w500` + card.backdrop_path} alt="" />
            <p>{card.original_title}</p>

          </Link>
        })}

      </div>
    </div>
  )
}

export default TitleCards
