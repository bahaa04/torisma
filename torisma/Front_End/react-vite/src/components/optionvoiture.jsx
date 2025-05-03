import { Home, Car } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom";

export default function OptionVoiture() {
  const navigate = useNavigate();
  const params = useParams();
  const wilaya = params.wilaya;

  const handleMaisonClick = () => {
    if (wilaya) {
      navigate(`/houses/${wilaya}`);
    } else {
      navigate('/houses');
    }
  };

  return (
    <div className="navigation">
      <div className="nav-item" onClick={handleMaisonClick} style={{cursor: 'pointer'}}>
        <Home className="nav-icon" />
        <span>Maison</span>
      </div>
      <div className={`nav-item${wilaya ? ' active' : ''}`} style={wilaya ? {pointerEvents: 'none', opacity: 0.6} : {}}>
        <Car className="nav-icon" />
        <span>Voiture</span>
      </div>
    </div>
  )
}
