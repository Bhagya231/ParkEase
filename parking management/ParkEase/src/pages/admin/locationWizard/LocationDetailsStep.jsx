
import { useEffect, useState } from "react";
import Card from "../../../components/common/Card";
import FormInput from "../../../components/common/FormInput";
import Button from "../../../components/common/Button";
import { validateLocationForm } from "../../../util/ValidateLocationForm";

const initialLocation = {
    locationName: "",
    area: "",
    address: "",
    openTime: "",
    closeTime: ""
};

function LocationDetailsStep({savedLocation,onSave, onNext,saving = false}) {
    const [formData, setFormData] = useState(initialLocation);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (!savedLocation) {

            setFormData({ ...initialLocation });
            setErrors({});
            setFormError("");
            return;
        }
            setFormData({
                locationName: savedLocation.locationName ?? "",
                area: savedLocation.area ?? "",
                address: savedLocation.address ?? "",
                openTime: savedLocation.openTime?.slice(0, 5) ?? "",
                closeTime: savedLocation.closeTime?.slice(0, 5) ?? ""
            });
        
        setErrors({});
        setFormError("");

    }, [savedLocation]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData(previous => ({ ...previous, [name]: value}));

        setErrors(previous => ({...previous, [name]: "" }));
        setFormError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateLocationForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;


         try {

            setFormError("");

            const saved = await onSave(formData);

            if (saved?.id) {
                onNext(saved);
            } else {
                setFormError("Location could not be saved. Please try again.");
            }
        } catch (error) 
        {
            setFormError( error.message || "Failed to save the location.");
        }

    }

    return (
        <Card
            title="Location Details"
            description="Enter the basic information for your parking location."
            className="border-0"
        >
            <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                    <div className="col-md-6">
                        <FormInput
                            label="Location Name"
                            name="locationName"
                            value={formData.locationName}
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
                            value={formData.area}
                            onChange={handleChange}
                            placeholder="e.g. Madhapur"
                            error={errors.area}
                            required
                        />
                    </div>

                    <div className="col-12">
                        <FormInput
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter the complete address"
                            error={errors.address}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <FormInput
                            label="Opening Time"
                            name="openTime"
                            type="time"
                            value={formData.openTime}
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
                            value={formData.closeTime}
                            onChange={handleChange}
                            error={errors.closeTime}
                            required
                        />
                    </div>
                </div>

                 {formError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {formError}
                    </div>
                )}


                <div className="d-flex justify-content-end mt-4">
                    <Button type="submit" loading={saving}>
                        Save & Continue
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default LocationDetailsStep;
