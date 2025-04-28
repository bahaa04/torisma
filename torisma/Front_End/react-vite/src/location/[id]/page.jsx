
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';




export default function CarPage() {



    const cars = [
        {
            id: 1,
            location: "Cheraga",
            brand: "DACIA",
            model: "DUSTER",
            price: 8500,
            currency: "DA",
            images: [
              "/alger.jpg",
              "/jijel.jpg",
              "/skikda.jpg",
            ],
          },
          {
            id: 2,
            location: "Bab Ezzouar",
            brand: "MERCEDES",
            model: "classe C",
            price: 25000,
            currency: "DA",
            images: [
              "/images/mercedes-c-1.jpg",
              "/images/mercedes-c-2.jpg",
              "/images/mercedes-c-3.jpg",
            ],
          },
          {
            id: 3,
            location: "Beraki",
            brand: "MERCEDES",
            model: "GLC",
            price: 40000,
            currency: "DA",
            images: [
              "/images/mercedes-glc-1.jpg",
              "/images/mercedes-glc-2.jpg",
              "/images/mercedes-glc-3.jpg",
            ],
          },
        ]
      

  const { id } = useParams();
  const carId = parseInt(id, 10);


  const car = cars.find(c => c.id === carId);


  if (!car) {
    return (
      <div className="error-page">
        <h1>Car not found</h1>
        <Link to="/" className="back-button">
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
