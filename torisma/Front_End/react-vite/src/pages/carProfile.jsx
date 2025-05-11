import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarC from "../components/navbar1-connected";
import Footer from "../components/footer";
import CarProfile from "../components/CarProfile";
import "../styles/CarProfile.css";

function CProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/listings/cars/${id}/`, {
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Failed to fetch car');
                const data = await response.json();
                setCar(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/listings/cars/${id}/`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to delete car');
            navigate('/voiture-liste');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdate = async (updatedData) => {
        try {
            const response = await fetch(`http://localhost:8000/api/listings/cars/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('Failed to update car');
            const data = await response.json();
            setCar(data);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!car) return <div>Car not found</div>;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <NavbarC />
            <main className="flex-grow flex justify-center items-start p-6">
                <CarProfile 
                    car={car} 
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </main>
            <Footer />
        </div>
    );
}

export default CProfile;