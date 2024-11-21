import React from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'

const TitleCards = () => {
  return (
    <div className='title-cards'>
      <h2>Popular On Netflix</h2>

      <div className="card-list">

      {/* map() method loops through the cards_data array. here 'card' represents the current element (like data for each card), and 'index' is the position of that element in the array (its a unique key for each card). */}
        {cards_data.map((card, index) => {
          return <div className="card" key={index}>

            {/* we are using card here because we are accessing each data from cards_data array */}
            <img src={card.image} alt="" /> 
            <p>{card.name}</p>

          </div>
        })}
        
      </div>
    </div>
  )
}

export default TitleCards
