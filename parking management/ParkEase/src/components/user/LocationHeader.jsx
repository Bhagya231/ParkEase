
import { useNavigate } from "react-router-dom";

function LocationHeader({ location })
 {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-4 shadow-sm p-3 p-md-4 mb-4">
      <button
        type="button"
        className="btn btn-light btn-sm mb-3"
        onClick={() => navigate("/customer/find-parking")}
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back to Locations
      </button>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <div className="text-success small fw-semibold mb-2">
            <i className="bi bi-geo-alt-fill me-2"></i>
            PARKING LOCATION
          </div>

          <h3 className="fw-bold mb-2">
            {location?.locationName || "Parking Location"}
          </h3>

          <div className="text-secondary mb-2">
            <i className="bi bi-geo-alt me-2"></i>
            {location?.area || "Area not available"}
          </div>

          {location?.address && (
            <p className="text-secondary small mb-0">
              {location.address}
            </p>
          )}
        </div>

        <div className="rounded-3 bg-success bg-opacity-10 p-3 text-success">
          <i className="bi bi-p-circle fs-2"></i>
          <div className="small fw-semibold mt-1">
            Smart Parking
          </div>
        </div>
      </div>
    </div>
  );
}

export default LocationHeader;
