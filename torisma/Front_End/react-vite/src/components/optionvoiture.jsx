import { MapPin, Home, Car } from "lucide-react"
import {Link} from "react-router-dom";


export default function OptionVoiture() {
  return (
    <div className="navigation">


      <Link to="/" className="no-underline">
      <div className="nav-item">
        <MapPin className="nav-icon" />
        <span>Wilaya</span>
      </div>
    </Link>

<Link to ="/maison1" className="no-underline">
      <div className="nav-item">
        <Home className="nav-icon" />
        <span>Maison</span>
      </div>
</Link>

      <div className="nav-item active">
        <Car className="nav-icon" />
        <span>Voiture</span>
      </div>
    </div>
  )
}
