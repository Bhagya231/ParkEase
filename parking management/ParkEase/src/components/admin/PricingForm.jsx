
import { useEffect, useState } from "react";

import Card from "../common/Card";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelection";
import Button from "../common/Button";

function PricingForm({
    selectedPrice = null,
    onSubmit,
    onCancel,
    loading = false
}) {
    const initialFormData = {
        vehicleType: "CAR",
        hourPrice: "",
        overstayPrice: ""
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const isEditing = Boolean(selectedPrice);

    useEffect(() => {
        if (selectedPrice) {
            setFormData({
                vehicleType: selectedPrice.vehicleType || "CAR",
                hourPrice: selectedPrice.hourPrice ?? "",
                overstayPrice: selectedPrice.overstayPrice ?? ""
            });
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
    }, [selectedPrice]);

    const vehicleOptions = [
        { value: "CAR", label: "Car" },
        { value: "BIKE", label: "Bike" },
        { value: "EV", label: "Electric Vehicle" }
    ];

    function handleChange(name, value) {
        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

        setErrors(previous => ({
            ...previous,
            [name]: ""
        }));
    }

    function validateForm() {
        const newErrors = {};

        if (!formData.vehicleType) {
            newErrors.vehicleType = "Please select a vehicle type.";
        }

        ["hourPrice", "overstayPrice"].forEach(field => {
            const value = formData[field];
            const label = field === "hourPrice"
                ? "Hourly price"
                : "Overstay price";

            if (value === "" || value === null) {
                newErrors[field] = `${label} is required.`;
                return;
            }

            const amount = Number(value);

            if (!Number.isFinite(amount) || amount < 1) {
                newErrors[field] = `${label} must be at least ₹1.00.`;
            } else if (!/^\d{1,8}(\.\d{1,2})?$/.test(String(value))) {
                newErrors[field] =
                    `${label} must have at most 8 integer digits and 2 decimal places.`;
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit({
            intent: isEditing ? "update" : "create",
            pricingId: selectedPrice?.id,
            vehicleType: formData.vehicleType,
            hourPrice: formData.hourPrice,
            overstayPrice: formData.overstayPrice
        });
    }

    return (
        <Card title={isEditing ? "Edit Pricing" : "Create Pricing"}>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <FormSelect
                            label="Vehicle Type"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={event =>
                                handleChange("vehicleType", event.target.value)
                            }
                            options={vehicleOptions}
                            required
                        />
                        {errors.vehicleType && (
                            <div className="text-danger small mt-1">
                                {errors.vehicleType}
                            </div>
                        )}
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Hourly Price (₹)"
                            name="hourPrice"
                            inputType="number"
                            value={formData.hourPrice}
                            onChange={event =>
                                handleChange("hourPrice", event.target.value)
                            }
                            placeholder="Enter hourly price"
                            required
                        />
                        {errors.hourPrice && (
                            <div className="text-danger small mt-1">
                                {errors.hourPrice}
                            </div>
                        )}
                    </div>

                    <div className="col-md-4">
                        <FormInput
                            label="Overstay Price (₹)"
                            name="overstayPrice"
                            inputType="number"
                            value={formData.overstayPrice}
                            onChange={event =>
                                handleChange("overstayPrice", event.target.value)
                            }
                            placeholder="Enter overstay price"
                            required
                        />
                        {errors.overstayPrice && (
                            <div className="text-danger small mt-1">
                                {errors.overstayPrice}
                            </div>
                        )}
                    </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEditing
                                ? "Update Pricing"
                                : "Create Pricing"}
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

export default PricingForm;
