import { useLoaderData, useNavigate } from "react-router-dom";
import img from "../../assets/airport.jpg";


import LocationSummary from "../../components/user/LocationSummary";
import PricingTable from "../../components/user/PricingTable";

function LocationDetailsPage() {
  const { location } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="container-fluid py-4">
      {/* Back button */}
      <button
        type="button"
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate("/customer/find-parking")}
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back to Locations
      </button>

      {/* Location details */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row align-items-center g-4">
            {/* Location image */}
            <div className="col-12 col-md-4">
              <img
                src={img}
                alt={location.locationName || "Parking location"}
                className="img-fluid rounded-3 w-100"
                style={{
                  height: "240px",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Location information */}
            <div className="col-12 col-md-8">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h3 className="mb-0">
                  {location.locationName?.trim()}
                </h3>

                <span
                  className={`badge ${
                    location.status === "ACTIVE"
                      ? "text-bg-success"
                      : "text-bg-secondary"
                  }`}
                >
                  {location.status}
                </span>
              </div>

              <p className="text-secondary mb-3">
                <i className="bi bi-geo-alt me-2"></i>
                {location.address}
              </p>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <p className="text-secondary small mb-1">Area</p>
                  <p className="fw-semibold mb-0">
                    {location.area || "Not specified"}
                  </p>
                </div>

                <div className="col-12 col-sm-6">
                  <p className="text-secondary small mb-1">
                    Operating Hours
                  </p>
                  <p className="fw-semibold mb-0">
                    <i className="bi bi-clock me-2 text-success"></i>
                    {location.openTime} – {location.closeTime}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parking overview: three summary cards */}
      <LocationSummary summary={location} />

      {/* Combined vehicle availability and pricing table */}
      <PricingTable
        locationId={location.id}
        summary={location}
      />

      {/* Navigate to floors and slots */}
      <div className="d-flex justify-content-end mt-4">
        <button
          type="button"
          className="btn btn-success px-4 py-2"
          onClick={() =>
            navigate(`/customer/locations/${location.id}/floors`)
          }
        >
          View Floors & Slots
          <i className="bi bi-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  );
}

export default LocationDetailsPage;