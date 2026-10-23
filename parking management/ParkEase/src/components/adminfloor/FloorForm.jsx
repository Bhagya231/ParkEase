
import { useEffect, useState } from "react";

import Button from "../common/Button";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelection";
import Card from "../common/Card";

function FloorForm({
    locations = [],
    selectedFloor = null,
    onSubmit,
    onCancel,
    loading = false
}) {
    const [formData, setFormData] = useState({
        locationId: "",
        floorName: "",
        floorNumber: ""
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedFloor) {
            setFormData({
                locationId: selectedFloor.locationId || "",
                floorName: selectedFloor.floorName || "",
                floorNumber: selectedFloor.floorNumber ?? ""
            });
        } else {
            setFormData({
                locationId: "",
                floorName: "",
                floorNumber: ""
            });
        }

        setErrors({});
    }, [selectedFloor]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.locationId) {
            newErrors.locationId = "Please select a parking location.";
        }

        if (!formData.floorName.trim()) {
            newErrors.floorName = "Floor name is required.";
        } else if (formData.floorName.trim().length > 50) {
            newErrors.floorName = "Floor name cannot exceed 50 characters.";
        }

        const floorNumber = Number(formData.floorNumber);

        if (
            formData.floorNumber === "" ||
            !Number.isInteger(floorNumber) ||
            floorNumber < 0
        ) {
            newErrors.floorNumber =
                "Enter a valid, non-negative floor number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit({
            locationId: formData.locationId,
            floorName: formData.floorName.trim(),
            floorNumber: Number(formData.floorNumber),
            floorId: selectedFloor?.id
        });
    };

    const locationOptions = locations.map((location) => ({
        value: location.id,
        label: location.locationName
    }));

    return (
        <Card>
            <h5 className="mb-4">
                {selectedFloor ? "Edit Floor" : "Add New Floor"}
            </h5>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <FormSelect
                        label="Parking Location"
                        name="locationId"
                        value={formData.locationId}
                        onChange={handleChange}
                        options={locationOptions}
                        error={errors.locationId}
                        required
                    />
                </div>

                <div className="mb-3">
                    <FormInput
                        label="Floor Name"
                        name="floorName"
                        value={formData.floorName}
                        onChange={handleChange}
                        error={errors.floorName}
                        placeholder="Example: Level 1"
                        required
                    />
                </div>

                <div className="mb-4">
                    <FormInput
                        label="Floor Number"
                        name="floorNumber"
                        type="number"
                        value={formData.floorNumber}
                        onChange={handleChange}
                        error={errors.floorNumber}
                        placeholder="Enter floor number"
                        required
                    />
                </div>

                <div className="d-flex gap-2">
                    <Button
                        type="submit"
                        variant="success"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : selectedFloor
                                ? "Update Floor"
                                : "Create Floor"}
                    </Button>

                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default FloorForm;
