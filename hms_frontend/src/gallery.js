import { useState } from 'react';
import { sculptureList } from './data.js';
import './gallery.css';


export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false); // 👈 added state


  function handleClick() {
    setIndex((index + 1) % sculptureList.length);
    setShowDetails(false); // 👈 reset details when moving to next
  }


  const sculpture = sculptureList[index];


  return (
    <div className="gallery-container">
      <div className="gallery-card">
        <img src={sculpture.url} alt={sculpture.alt} className="gallery-img" />
        <div className="gallery-text">
          <h2>{sculpture.name}</h2>
          <h4>by {sculpture.artist}</h4>


          {/* 👇 Just this button was added */}
          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? "Hide Details" : "Show Details"}
          </button>


          {/* 👇 Show description conditionally */}
          {showDetails && (
            <>
              <p>{sculpture.description}</p>
              <p className="count">
                ({index + 1} of {sculptureList.length})
              </p>
            </>
          )}


          <button onClick={handleClick}>Next Hostel</button>
        </div>
      </div>
    </div>
  );
}
