import { Home, Car } from "lucide-react"
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function OptionMaison() {
  const navigate = useNavigate();
  const params = useParams();
  const wilaya = params.wilaya;

  const handleCarClick = () => {
    if (wilaya) {
      navigate(`/cars/${wilaya}`);
    } else {
      navigate('/cars');
    }
  };

  return (
    <div className="navigation">
      <div className={`nav-item${wilaya ? ' active' : ''}`} style={wilaya ? {pointerEvents: 'none', opacity: 0.6} : {}}>
        <Home className="nav-icon" />
        <span>Maison</span>
      </div>
      <div className="nav-item" onClick={handleCarClick} style={{cursor: 'pointer'}}>
        <Car className="nav-icon" />
        <span>Voiture</span>
      </div>
    </div>
  )
}
