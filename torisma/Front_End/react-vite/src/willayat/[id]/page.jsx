
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';




export default function DestPage() {



    const dests = [
        {
            id: 1,
            location: "Cheraga",
           
            images: [
              "/alger.jpg",
              "/jijel.jpg",
              "/skikda.jpg",
            ],
          },
          {
            id: 2,
            location: "Bab Ezzouar",
          
            images: [
              "/images/mercedes-c-1.jpg",
              "/images/mercedes-c-2.jpg",
              "/images/mercedes-c-3.jpg",
            ],
          },
          {
            id: 3,
            location: "Beraki",
           
            images: [
              "/images/mercedes-glc-1.jpg",
              "/images/mercedes-glc-2.jpg",
              "/images/mercedes-glc-3.jpg",
            ],
          },
        ]
      

  const { id } = useParams();
  const destId = parseInt(id, 10);


  const dest = dests.find(c => c.id === destId);


  if (!dest) {
    return (
      <div className="error-page">
        <h1>destination not found</h1>
        <Link to="/" className="back-button">
          <ArrowLeft className="back-icon" />
          Back to listings
        </Link>
      </div>
    );
  }


  const redirectMap = {
    1: '/voiture-alger',
    2: '/',
    3: '/',
  };
  const destination = redirectMap[destId] || '/';


  React.useEffect(() => {
 
    window.location.replace(destination);
  }, [destination]);

 
  return <p>Redirecting you…</p>;
}
