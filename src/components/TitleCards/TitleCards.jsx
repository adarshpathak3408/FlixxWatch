import React, { useEffect, useRef } from 'react'
import './TitleCards.css'
import cards_data from '../../assets/cards/Cards_data'

const TitleCards = ({title, category}) => {

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
  }, [])

  return (
    <div className='title-cards'>
      {/* if title is passed as props then it will be displayed, otherwise it will display "Popular On Netflix" */}
      <h2>{title ? title: "Popular On Netflix"}</h2> 

      <div className="card-list" ref={cardsRef}>

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
