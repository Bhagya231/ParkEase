
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/common/Card";
import FormInput from "../../components/common/FormInput";
import Button from "../../components/common/Button";
import  { validateLocationForm }  from "../../util/ValidateLocationForm";

const steps = [
  "Location Details",
  "Pricing",
  "Floors",
  "Slots",
  "Review",
];

const initialLocation = {
  locationName: "",
  area: "",
  address: "",
  openTime: "",
  closeTime: "",
};

function AddLocationWizard() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [location, setLocation] = useState(initialLocation);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setLocation((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  }

  function validateLocation() {
    const validationErrors = validateLocationForm(location);

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  }

  function handleNext() {
    if (currentStep === 0 && !validateLocation()) {
      return;
    }

    setCurrentStep((previous) =>
      Math.min(previous + 1, steps.length - 1)
    );
  }

  function handleBack() {
    setCurrentStep((previous) =>
      Math.max(previous - 1, 0)
    );
  }

  function handleCancel() {
    navigate("/admin/locations");
  }

  function handleFinish() {
    // Backend save and activation will be added
    // after the API integration is implemented.
    navigate("/admin/locations");
  }

  function renderLocationDetails() {
    return (
      <>
        <div className="mb-4">
          <h5 className="fw-semibold">Basic Information</h5>
          <p className="text-muted mb-0">
            Enter the parking location details.
          </p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <FormInput
              label="Location Name"
              name="locationName"
              value={location.locationName}
              onChange={handleChange}
              placeholder="e.g. City Center Parking"
              error={errors.locationName}
              required
            />
          </div>

          <div className="col-md-6">
            <FormInput
              label="Area"
              name="area"
              value={location.area}
              onChange={handleChange}
              placeholder="e.g. Madhapur"
              error={errors.area}
              required
            />
          </div>

          <div className="col-12">
            <FormInput
              label="Full Address"
              name="address"
              inputType="textarea"
              value={location.address}
              onChange={handleChange}
              placeholder="Enter the complete parking address"
              error={errors.address}
              rows={3}
              required
            />
          </div>

          <div className="col-md-6">
            <FormInput
              label="Opening Time"
              name="openTime"
              type="time"
              value={location.openTime}
              onChange={handleChange}
              error={errors.openTime}
              required
            />
          </div>

          <div className="col-md-6">
            <FormInput
              label="Closing Time"
              name="closeTime"
              type="time"
              value={location.closeTime}
              onChange={handleChange}
              error={errors.closeTime}
              required
            />
          </div>
        </div>
      </>
    );
  }

  function renderStepContent() {
    switch (currentStep) {
      case 0:
        return renderLocationDetails();

      case 1:
        return (
          <div>
            <h5 className="fw-semibold">Configure Pricing</h5>
            <p className="text-muted">
              Next, configure hourly and overstay prices for
              each vehicle type.
            </p>
            <p className="small text-secondary">
              Pricing form and API integration are pending.
            </p>
          </div>
        );

      case 2:
        return (
          <div>
            <h5 className="fw-semibold">Add Parking Floors</h5>
            <p className="text-muted">
              Add the floors available at this location.
            </p>
            <p className="small text-secondary">
              Floor form and API integration are pending.
            </p>
          </div>
        );

      case 3:
        return (
          <div>
            <h5 className="fw-semibold">Configure Parking Slots</h5>
            <p className="text-muted">
              Add parking slots to the floors you configure.
            </p>
            <p className="small text-secondary">
              Slot form and API integration are pending.
            </p>
          </div>
        );

      case 4:
        return (
          <div>
            <h5 className="fw-semibold mb-3">
              Review Location Details
            </h5>

            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <tbody>
                  <tr>
                    <th scope="row">Location Name</th>
                    <td>{location.locationName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Area</th>
                    <td>{location.area}</td>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <td>{location.address}</td>
                  </tr>
                  <tr>
                    <th scope="row">Opening Time</th>
                    <td>{location.openTime}</td>
                  </tr>
                  <tr>
                    <th scope="row">Closing Time</th>
                    <td>{location.closeTime}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-muted small">
              This is a preview only. The location has not
              been saved to the backend.
            </p>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Add Parking Location</h3>
          <p className="text-muted mb-0">
            Configure a location and its parking facilities.
          </p>
        </div>

        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <Card className="mb-4">
        <div className="row g-3">
          {steps.map((step, index) => (
            <div className="col" key={step}>
              <div className="d-flex flex-column align-items-center text-center">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                    index === currentStep
                      ? "bg-primary text-white"
                      : index < currentStep
                        ? "bg-success text-white"
                        : "bg-light text-secondary border"
                  }`}
                  style={{
                    width: "38px",
                    height: "38px",
                    fontWeight: 600,
                  }}
                >
                  {index + 1}
                </div>

                <span
                  className={`small ${
                    index === currentStep
                      ? "fw-bold text-primary"
                      : "text-muted"
                  }`}
                >
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="progress mt-4" style={{ height: "5px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${
                (currentStep / (steps.length - 1)) * 100
              }%`,
            }}
            aria-valuenow={currentStep}
            aria-valuemin={0}
            aria-valuemax={steps.length - 1}
          />
        </div>
      </Card>

      <Card>
        {renderStepContent()}

        <div className="d-flex justify-content-between flex-wrap gap-2 mt-4 pt-3 border-top">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleFinish}>
              Finish
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AddLocationWizard;
