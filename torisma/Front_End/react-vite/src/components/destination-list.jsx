import React from "react";
import DestinationCard from "./destination-card";

export default function DestinationList({ dests }) {
  return (
    <div className="car-list">
      {dests.map((dest, index) => (
        <DestinationCard key={dest.id} dest={dest} index={index} />
      ))}
    </div>
  );
}
