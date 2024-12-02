import React, { useEffect, useState } from 'react'
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams } from 'react-router-dom'

const Player = () => {

  // useParams extracts the 'id' from the URL, which is used to fetch data for a specific movie
  const {id} = useParams();

  // it allows us to go back or navigate to other pages in the website
  const navigateBack = useNavigate();

  // we are using useState here to store and manage the data fetched from the API
  const [apiDataSet, setApiDataSet] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  })

  // This defines the API request details like method, headers, and authorization token. It is static and reused for all the API calls, so we define it outside to avoid repeating it
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjAwNmU2OTFkNzA5MDNjMGIzOTkxZDc5YzIwYjdlZSIsIm5iZiI6MTczMjg2OTE4MC4zMzA5MjQ1LCJzdWIiOiI2NzQ0Mjc1NjRkNTBjY2Q3ZGE0OGM4ZTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.bfRAglZVP9rzCfWAFXh8ZY8rXLpVg0HSXuZvzbE0Mrs'
    }
  };
  
  // The API call to fetch data happens here inside useEffect. This ensures the data is fetched only once when the component loads, avoiding repeated calls on every render
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
    .then(res => res.json())
    .then(res => setApiDataSet(res.results[0]))
    .catch(err => console.error(err));
  },[])



  return (
    <div className='player'>

      {/* navigateBack(-2) takes the user to the previous page, like pressing the browser's back button */}
      <img src={back_arrow_icon} alt="" onClick={() => {navigateBack(-2)}} />

      <iframe width='90%' height='90%'
        src={`https://www.youtube.com/embed/${apiDataSet.key}`} 
        title='Trailer' frameBorder='0' allowFullScreen>
      </iframe>

      <div className="player-info">
        <p>{apiDataSet.published_at.slice(0,10)}</p>
        <p>{apiDataSet.name}</p>
        <p>{apiDataSet.type}</p>
      </div>
    </div>
  )
}

export default Player
