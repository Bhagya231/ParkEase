import { Link } from "react-router-dom";


function CustomerDashboard() {
  return (
    <div>
      <div className="mb-4">
        <p className="text-secondary mb-1">Workspace / Home</p>
        <h2 className="fw-bold mb-1">Welcome to ParkEise</h2>
        <p className="text-secondary mb-0">
          Find parking and manage your parking activity in one place.
        </p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center g-4">
            <div className="col-md-8">
              <span className="badge text-bg-success mb-3">
                Smart Parking
              </span>

              <h3 className="fw-bold">Looking for a parking spot?</h3>

              <p className="text-secondary mb-4">
                Explore parking locations and find a convenient place to park.
              </p>

              <Link to="/customer/find-parking" className="btn btn-success">
                <i className="bi bi-search me-2"></i>
                Find Parking
              </Link>
            </div>

            <div className="col-md-4 text-center">
              <i className="bi bi-p-square text-success" style={{ fontSize: "100px" }}></i>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <i className="bi bi-calendar-check fs-2 text-success"></i>
              <h5 className="fw-bold mt-3">My Reservations</h5>
              <p className="text-secondary">
                View  your parking reservations.
              </p>
              <Link to="/customer/reservations"
                className="btn btn-outline-success"
              >
                View Reservations
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <i className="bi bi-clock-history fs-2 text-success"></i>
              <h5 className="fw-bold mt-3">My Sessions</h5>
              <p className="text-secondary">
                Check your active  parking sessions.
              </p>
              <Link
                to="/customer/sessions"
                className="btn btn-outline-success"
              >
                View Sessions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;