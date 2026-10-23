
import { useEffect, useState } from "react";
import Card from "../common/Card";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelection";
import Button from "../common/Button";
import { validateSlotForm } from "../../util/ValidateLocationForm"



const initialFormData = {
    sectionName: "A",
    startingNumber: 1,
    slotCount: 10,
    slotNumber: "",
    vehicleType: "CAR",
    slotType: "STANDARD"
};


function SlotForm({ floorId, selectedSlot = null, onSubmit, onCancel, loading = false })
{

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const isEditing = Boolean(selectedSlot);


      useEffect(() => {
        if (selectedSlot) {
            setFormData({
                sectionName: selectedSlot.sectionName || "",
                startingNumber: 1,
                slotCount: 10,
                slotNumber: selectedSlot.slotNumber || "",
                vehicleType: selectedSlot.vehicleType || "CAR",
                slotType: selectedSlot.slotType || "STANDARD"
            });
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
    }, [selectedSlot, floorId]);

      const vehicleOptions = [
        { value: "CAR", label: "Car" },
        { value: "BIKE", label: "Bike" },
        { value: "EV", label: "Electric Vehicle" }
    ];


     const slotTypeOptions = [
        { value: "STANDARD", label: "Standard" },
        { value: "EV_CHARGING", label: "EV Charging" },
        { value: "ACCESSIBLE", label: "Accessible" }
    ];

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({...previous,[name]: value}));

        setErrors((previous) => ({...previous,[name]: ""}));
            
   
    }


    function handleSubmit(event) {
        event.preventDefault();

        const validationErrors = validateSlotForm( formData, isEditing);

        if (!floorId) {
            validationErrors.floorId = "Please select a floor first.";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        
        if (isEditing) {
            onSubmit({
                intent: "update",
                slotId: selectedSlot.id,
                slotNumber: formData.slotNumber.trim(),
                sectionName: formData.sectionName.trim(),
                vehicleType: formData.vehicleType,
                slotType: formData.slotType});
             } else {
            onSubmit({
                intent: "create",
                floorId,
                sectionName: formData.sectionName.trim(),
                startingNumber: Number(formData.startingNumber),
                slotCount: Number(formData.slotCount),
                vehicleType: formData.vehicleType,
                slotType: formData.slotType
            });
        }
    }

    return (


         <Card title={isEditing ? "Update Parking Slot" : "Create Parking Slots"}>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <FormInput
                            label="Section Name"
                            name="sectionName"
                            value={formData.sectionName}
                            onChange={handleChange}
                            placeholder="e.g. A"
                            required
                        />

                        {errors.sectionName && (
                            <small className="text-danger">
                                {errors.sectionName}
                            </small>
                        )}
                    </div>

                    {isEditing ? ( <div className="col-md-6">
                            <FormInput
                                label="Slot Number"
                                name="slotNumber"
                                value={formData.slotNumber}
                                onChange={handleChange}
                                placeholder="e.g. A01"
                                required
                            />

                            {errors.slotNumber && (
                                <small className="text-danger">
                                    {errors.slotNumber}
                                </small>
                            )}
                        </div>) : (
                             <>
                            <div className="col-md-3">
                                <FormInput
                                    label="Starting Number"
                                    name="startingNumber"
                                    type="number"
                                    value={formData.startingNumber}
                                    onChange={handleChange}
                                    required
                                />

                                {errors.startingNumber && (
                                    <small className="text-danger">
                                        {errors.startingNumber}
                                    </small>
                                )}
                            </div>

                             <div className="col-md-3">
                                <FormInput
                                    label="Number of Slots"
                                    name="slotCount"
                                    type="number"
                                    value={formData.slotCount}
                                    onChange={handleChange}
                                    required
                                />

                                {errors.slotCount && (
                                    <small className="text-danger">
                                        {errors.slotCount}
                                    </small>
                                )}
                            </div>
                        </>
                    )}

                     <div className="col-md-6">
                        <FormSelect
                            label="Vehicle Type"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            options={vehicleOptions}
                            required
                        />

                        {errors.vehicleType && (
                            <small className="text-danger">
                                {errors.vehicleType}
                            </small>
                        )}
                    </div>

                     <div className="col-md-6">
                        <FormSelect
                            label="Slot Type"
                            name="slotType"
                            value={formData.slotType}
                            onChange={handleChange}
                            options={slotTypeOptions}
                            required
                        />

                        {errors.slotType && (
                            <small className="text-danger">
                                {errors.slotType}
                            </small>
                        )}
                    </div>

                     {errors.floorId && (
                        <div className="col-12">
                            <p className="text-danger mb-0">
                                {errors.floorId}
                            </p>
                        </div>
                    )}

                    <div className="col-12 d-flex gap-2">
                        <Button
                            type="submit"
                            loading={loading}
                            disabled={loading || !floorId}
                        >
                            {isEditing ? "Update Slot" : "Create Slots"}
                        </Button>

                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline-secondary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Card>








    );




}




export default SlotForm;
