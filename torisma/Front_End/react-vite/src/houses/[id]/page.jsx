
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';




export default function HousePage() {



    const houses = [
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
  const houseId = parseInt(id, 10);


  const house = houses.find(c => c.id === houseId);


  if (!house) {
    return (
      <div className="error-page">
        <h1>House not found</h1>
        <Link to="/maison1" className="back-button">
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
  const destination = redirectMap[houseId] || '/';


  React.useEffect(() => {
 
    window.location.replace(destination);
  }, [destination]);


  return <p>Redirecting you…</p>;
}
