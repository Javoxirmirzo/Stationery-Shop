import { useState } from 'react';
import './Produc.Cards.css';


function ProductCards({  stationeries, onDelete , user}) {
  const [stationeryGroup, setStationeryGroup] = useState(
    JSON.parse(localStorage.getItem('mystationery'))
      ? JSON.parse(localStorage.getItem('mystationery'))
      : []
  );

  return (
    <div className='cards_container'>
      {stationeryGroup.map((stationery, index) => (
        <div key={index} className='cards'>
          <div>
            <img src={stationery.stationery_image} alt=''/>
          </div>

          <div className='cards_info'>
            <h2>{stationery.stationery_name} </h2>
            <p>{stationery.stationery_des}</p>
            <h3>{stationery.cost}</h3>

          </div>
          {user?.email === 'admin@gmail.com' && (
            <button className="delete-btn" onClick={() => onDelete(index)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductCards;
