
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';




export default function CarPage() {



    const cars = [
        {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
        ]
      
 
  const { id } = useParams();
  const carId = parseInt(id, 10);


  const car = cars.find(c => c.id === carId);


  if (!car) {
    return (
      <div className="error-page">
        <h1>Car not found</h1>
        <Link to="/voiture1" className="back-button">
          <ArrowLeft className="back-icon" />
          Back to listings
        </Link>
      </div>
    );
  }


  const redirectMap = {
    1: '*',
    2: '*',
    3: '*',
  };
  const destination = redirectMap[carId] || '/';


  React.useEffect(() => {
 
    window.location.replace(destination);
  }, [destination]);


  return <p>Redirecting you…</p>;
}
