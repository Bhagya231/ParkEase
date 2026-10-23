
import StatusBadge from "../../../components/common/StatusBadge"

import noLocationsImage from "/NoLocationParking.png"

function LocationTable({
  locations = [],
  onView,
  onContinueSetup,
 
}) {
  if (locations.length === 0) {
    return (


      <div className=" text-center">
          <img
          src={noLocationsImage}
          alt="No parking locations available"
          className="img-fluid mb-3"
          style={{
            maxWidth: "440px",
            maxHeight: "420px",
            objectFit: "contain",
          }}
        />
      </div>
      

      // <div className="card border-0 shadow-sm">
      //   <div className="card-body text-center py-5">
      //     <img
      //     src={noLocationsImage}
      //     alt="No parking locations available"
      //     className="img-fluid mb-3"
      //     style={{
      //       maxWidth: "340px",
      //       maxHeight: "320px",
      //       objectFit: "contain",
      //     }}
      //   />
      //   </div>
      // </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="px-3 py-3">Location</th>
              <th className="py-3">Area</th>
              <th className="py-3">Operating Hours</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-end pe-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((location) => {

              const isInActive = location.status === "INACTIVE";

              

              return (
                <tr key={location.id}>
                  <td className="px-3 py-3">
                    <div className="fw-semibold">
                      {location.locationName}
                    </div>

                    <small className="text-secondary">
                      <i className="bi bi-geo-alt-fill text-success"></i>
                      {location.address || "No address provided"}
                    </small>
                  </td>

                  <td>{location.area || "—"}</td>

                  <td>
                    {location.openTime && location.closeTime
                      ? `${location.openTime} - ${location.closeTime}`
                      : "—"}
                  </td>

                  <td>
                    <StatusBadge status={location.status} />
                  </td>

                  <td className="text-end pe-3">
                    <div className="d-flex justify-content-end align-items-center flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() =>  onView(location)}
                        title="View"
                      >
                         <i className="bi bi-eye" />
                        <span className="ms-1">View</span>
                      </button>

                      {isInActive && (
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={() => onContinueSetup(location)}
                        >
                          Continue Setup
                        </button>
                      )}




                      

                    
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LocationTable;
