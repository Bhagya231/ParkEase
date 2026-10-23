
import { useEffect, useState } from "react";

function getInitialFormData(location) {
  return {
    locationName: location?.locationName || "",
    address: location?.address || "",
    area: location?.area || "",
    openTime: location?.openTime || "",
    closeTime: location?.closeTime || "",
  };
}

function LocationFormModal({
  show,
  location,
  saving,
  error,
  onClose,
  onSubmit,
}) {
  const [formData, setFormData] = useState(
    () => getInitialFormData(location)
  );

  useEffect(() => {
    if (show) {
      setFormData(getInitialFormData(location));
    }
  }, [show, location]);

  if (!show) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(formData);
  }

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="locationModalTitle"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <div>
                  <h5
                    className="modal-title fw-bold"
                    id="locationModalTitle"
                  >
                    {location
                      ? "Edit Parking Location"
                      : "Add Parking Location"}
                  </h5>

                  <p className="text-secondary small mb-0">
                    Enter the location details below.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  disabled={saving}
                  onClick={onClose}
                />
              </div>

              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="locationName"
                      className="form-label fw-semibold"
                    >
                      Location Name
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      id="locationName"
                      name="locationName"
                      className="form-control"
                      value={formData.locationName}
                      onChange={handleChange}
                      placeholder="e.g. City Center Parking"
                      required
                      maxLength={100}
                      disabled={saving}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="area"
                      className="form-label fw-semibold"
                    >
                      Area
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      id="area"
                      name="area"
                      className="form-control"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="e.g. MG Road"
                      required
                      maxLength={100}
                      disabled={saving}
                    />
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="address"
                      className="form-label fw-semibold"
                    >
                      Address
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      className="form-control"
                      rows="2"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter the complete address"
                      required
                      maxLength={500}
                      disabled={saving}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="openTime"
                      className="form-label fw-semibold"
                    >
                      Opening Time
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      id="openTime"
                      name="openTime"
                      type="time"
                      className="form-control"
                      value={formData.openTime}
                      onChange={handleChange}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="closeTime"
                      className="form-label fw-semibold"
                    >
                      Closing Time
                      <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      id="closeTime"
                      name="closeTime"
                      type="time"
                      className="form-control"
                      value={formData.closeTime}
                      onChange={handleChange}
                      required
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : location
                      ? "Update Location"
                      : "Create Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}

export default LocationFormModal;
