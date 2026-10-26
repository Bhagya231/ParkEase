import { useLoaderData, useNavigate,useRevalidator  } from "react-router-dom";

import { useState } from "react";
import api from "../../util/api";
import img from "../../assets/airport.jpg";
import Button from "../../components/common/Button";
import LocationSummary from "../../components/user/LocationSummary";
import PricingTable from "../../components/user/PricingTable";
import DeactivateConfirmationModal from "../../components/common/DeactivateConfirmationModal";

function AdminLocationDetailsPage()
{
    const { location, prices = [] } = useLoaderData();
    const navigate = useNavigate();
    const revalidator = useRevalidator();

    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    const targetStatus =location.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

    const handleEditLocation = () => {
        navigate(`/admin/locations/${location.id}/setup?step=1&mode=edit`);
    };

    const handleViewFloors = () => {
        navigate(`/admin/locations/${location.id}/floors`);
    };

    const handleEditPrice = (price) => {
         navigate( `/admin/locations/${location.id}/setup?step=2&mode=edit&priceId=${price.id}` );
    };

    const handleOpenStatusModal = () => {
        setStatusMessage("");
        setStatusError("");
        setShowStatusModal(true);
    };


    const handleConfirmStatusChange = async () => {
    try {
        setUpdatingStatus(true);
        setStatusError("");
        setStatusMessage("");

        await api.patch(`/admin/locations/${location.id}/status`,{status: targetStatus});

        setShowStatusModal(false);

        setStatusMessage(`Location ${targetStatus === "ACTIVE" ? "activated" : "deactivated"} successfully.`);

        // Reload location details to display the latest status.
        revalidator.revalidate();

    } catch (error) {
        console.error("Failed to update location status:", error);

        setStatusError(error.response?.data?.message ||  "Failed to update location status. Please try again.");
           
    } finally {
        setUpdatingStatus(false);
    }
};

    return (

         <div className="container-fluid py-4">
            
            <div className="small text-muted mb-3">
                <span
                role="button"
                className="text-success"
                onClick={() => navigate("/admin/locations")}
                >
                Locations
                </span>

                <i className="bi bi-chevron-right mx-2" />

                <span className="text-dark fw-medium">
                {location.locationName}
                </span>
            </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h3 className="fw-bold mb-0">
          {location.locationName}
        </h3>

        {statusMessage && (
            <div className="alert alert-success" role="alert">
                {statusMessage}
            </div>
        )}

        {statusError && (
            <div className="alert alert-danger" role="alert">
                {statusError}
            </div>
        )}

        {isAdmin && (
          <div className="d-flex gap-2">
            <Button
              variant="outline"
              onClick={handleEditLocation}
            >
              <i className="bi bi-pencil me-2" />
              Edit
            </Button>

            <Button
              variant={location.status === "ACTIVE" ? "danger" : "success"}
              onClick={handleOpenStatusModal}
              disabled={updatingStatus}

            >
              <i className={`bi ${location.status === "ACTIVE"? "bi-slash-circle": "bi-check-circle"} me-2`} />
                     {location.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </Button>
          </div>
        )}
      </div>

      {/* Location information */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3 p-lg-4">
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-4 col-lg-3">
              <img
                src={img}
                alt={location.locationName || "Parking location"}
                className="img-fluid rounded-3 w-100"
                style={{
                  height: "190px",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="col-12 col-md-8 col-lg-9">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div className="text-muted small">
                  <i className="bi bi-geo-alt-fill text-success me-2" />
                  Address
                  <div className="text-dark fw-medium mt-1">
                    {location.address || "Address not provided"}
                  </div>
                </div>

                <span
                  className={`badge rounded-pill px-3 py-2 ${
                    location.status === "ACTIVE"
                      ? "text-bg-success"
                      : "text-bg-secondary"
                  }`}
                >
                  {location.status}
                </span>
              </div>

              <div className="row g-3">
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="text-muted small">
                    <i className="bi bi-signpost-2 text-success me-2" />
                    Area
                  </div>
                  <div className="fw-semibold mt-1">
                    {location.area || "Not specified"}
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="text-muted small">
                    <i className="bi bi-clock text-success me-2" />
                    Operating Hours
                  </div>
                  <div className="fw-semibold mt-1">
                    {location.openTime || "--:--"} –{" "}
                    {location.closeTime || "--:--"}
                  </div>
                </div>

                {/* <div className="col-6 col-lg-2">
                  <div className="text-muted small">
                    <i className="bi bi-building text-success me-2" />
                    Floors
                  </div>
                  <div className="fs-4 fw-bold mt-1">
                    {location.floorCount ?? 0}
                  </div>
                </div>
                 <div className="col-6 col-lg-2">
                  <div className="text-muted small">
                    <i className="bi bi-p-square text-success me-2" />
                    Total Slots
                  </div>
                  <div className="fs-4 fw-bold mt-1">
                    {location.totalSlots ?? 0}
                  </div> */}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Reusable parking overview */}
      <LocationSummary summary={location} />

      {/* Pricing visible to both roles */}
      <PricingTable
        locationId={location.id}
        summary={location}
        role={role}
        pricingData={prices}
        onEditPrice={isAdmin ? handleEditPrice : undefined}
      />

      {/* Floor and slot navigation */}
      <div className="d-flex justify-content-end mt-4">
        <Button onClick={handleViewFloors}>
          <i className="bi bi-layers me-2" />
          View Floors 
          <i className="bi bi-arrow-right ms-2" />
        </Button>
      
      </div>


         <DeactivateConfirmationModal
            show={showStatusModal}
            title={ targetStatus === "ACTIVE"? "Activate Location": "Deactivate Location"}
      
            itemName={location.locationName}
            message={targetStatus === "ACTIVE"? "Are you sure you want to activate this location?" : "Are you sure you want to deactivate this location?"}
      
            confirmText={ targetStatus === "ACTIVE" ? "Activate" : "Deactivate"}
            onCancel={() => {
                if (!updatingStatus) {
                    setShowStatusModal(false);
                }
            }}
            onConfirm={handleConfirmStatusChange}
            loading={updatingStatus}
        />
      




    </div>

    



          




    );
}


export default AdminLocationDetailsPage;
