
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';




export default function DestPage() {



    const dests = [
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
    1: '/maison-alger',
    2: '/voiture-alger',
    3: '/',
  };
  const destination = redirectMap[destId] || '/';


  React.useEffect(() => {
 
    window.location.replace(destination);
  }, [destination]);

 
  return <p>Redirecting you…</p>;
}
