import { useState } from 'react';
import './Produc.Cards.css';


function ProductCards({ stationeries }) {
  const [stationeryGroup, setStationeryGroup] = useState(
    JSON.parse(localStorage.getItem('mystationery'))
      ? JSON.parse(localStorage.getItem('mystationery'))
      : []
  );

  return (
    <div>
      {stationeryGroup.map((stationery, index) => (
        <div key={index} className='card'>
          <div>
            <img src={stationery.stationery_image} alt=''/>
          </div>

          <div>
            <h2>{stationery.stationery_name} </h2>
            <p>{stationery.stationery_des}</p>
            <h3>{stationery.cost}</h3>

          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCards;
