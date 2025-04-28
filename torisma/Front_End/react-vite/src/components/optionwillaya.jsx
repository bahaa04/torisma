import { MapPin, Home, Car } from "lucide-react"
import {Link} from "react-router-dom";

export default function OptionWillaya() {
  return (
    <div className="navigation">
      <div className="nav-item active">
        <MapPin className="nav-icon" />
        <span>Wilaya</span>
      </div>

      <Link to="/maison1" className="no-underline">
      <div className="nav-item">
        <Home className="nav-icon" />
        <span>Maison</span>
      </div>
    </Link>


<Link to="/voiture1" className="no-underline">
      <div className="nav-item ">
        <Car className="nav-icon" />
        <span>Voiture</span>
      </div>
</Link>

    </div>
  )
}
