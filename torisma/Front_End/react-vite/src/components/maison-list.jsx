import React from "react";
import MaisonCard from "./maison-card";


export default function MaisonList({ houses }) {
  return (
    <div className="car-list">
      {houses.map((house, index) => (
        <MaisonCard key={house.id} house={house} index={index} />
      ))}
    </div>
  );
}
