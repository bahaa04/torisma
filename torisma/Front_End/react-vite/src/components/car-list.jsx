import React from "react";
import CarCard from "./car-card";


export default function CarList({ cars }) {
  return (
    <div className="car-list">
      {cars.map((car, index) => (
        <CarCard key={car.id} car={car} index={index} />
      ))}
    </div>
  );
}
