// src/pages/HProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarC from "../components/navbar1-connected";
import Footer from "../components/footer";
import HouseProfile from "../components/HouseProfile";
import "../styles/HouseProfile.css";

function HProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/listings/houses/${id}/`, {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch house');
        const data = await response.json();
        setHouse(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/listings/houses/${id}/`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete house');
      navigate('/maison-liste');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/listings/houses/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) throw new Error('Failed to update house');
      const data = await response.json();
      setHouse(data);
      navigate('/maison-liste'); // Redirect after successful update
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!house) return <div>House not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavbarC />
      <main className="flex-grow flex justify-center items-start p-6">
        <HouseProfile 
          house={house}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </main>
      <Footer />
    </div>
  );
}

export default HProfile;
