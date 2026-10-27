import { useState, useEffect } from "react";
import {
    useNavigate,
    useParams,
    useSearchParams
} from "react-router-dom";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

import LocationDetailsStep from "./locationWizard/LocationDetailsStep";
import PricingStep from "./locationWizard/PricingStep";
import FloorsStep from "./locationWizard/FloorStep";
import SlotsStep from "./locationWizard/SlotStep";
import ReviewStep from "./locationWizard/ReviewStep";

import { loadLocationWizard } from "../../util/locationWizardLoader";

import {
    SaveLocation,
    saveLocationPricing,
    saveLocationFloor,
    generateParkingSlots
} from "../../util/LocationWizardActions";


const steps = [
    "Location Details",
    "Pricing",
    "Floors",
    "Slots",
    "Review"
];


const initialData = {
    location: null,
    prices: [],
    floors: [],
    floor: null,
    slots: [],
    allSlots: [],
    isSetupComplete: false,
    nextStep: 0
};


// Determine the first incomplete step
function getStartingStep(data) {

    if (!data.location) {
        return 0;
    }

    const nextStep = Number(data.nextStep ?? 1);

    return Math.min(
        Math.max(nextStep, 1),
        steps.length - 1
    );
}


function AddLocationWizard() {

    const navigate = useNavigate();

    const { locationId } = useParams();

    const [searchParams] = useSearchParams();

    const requestedStep = searchParams.get("step");
    const mode = searchParams.get("mode");


    const [wizardData, setWizardData] = useState(initialData);

    const [currentStep, setCurrentStep] = useState(0);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    const {
        location,
        prices,
        floors,
        floor,
        slots,
        allSlots
    } = wizardData;


    // Load existing location setup
    useEffect(() => {

        let isMounted = true;

        async function loadData() {

            setLoading(true);
            setError("");

            try {

                const data = await loadLocationWizard(
                    locationId || null
                );

                if (!isMounted) {
                    return;
                }

                setWizardData(data);

                // Explicit Edit navigation takes priority
                if (
                    mode === "edit" &&
                    requestedStep !== null
                ) {

                    const stepNumber = Number(requestedStep);

                    if (
                        Number.isInteger(stepNumber) &&
                        stepNumber >= 1 &&
                        stepNumber <= steps.length
                    ) {

                        // URL uses 1-based step numbers.
                        // React state uses 0-based indexes.
                        setCurrentStep(stepNumber - 1);

                    } else {

                        setCurrentStep(getStartingStep(data));

                    }

                } else {

                    // Add Location or Continue Setup
                    setCurrentStep(getStartingStep(data));

                }

            } catch (err) {

                if (isMounted) {
                    setError(
                        err.message ||
                        "Failed to load setup data."
                    );
                }

            } finally {

                if (isMounted) {
                    setLoading(false);
                }

            }
        }

        loadData();

        return () => {
            isMounted = false;
        };

    }, [locationId, requestedStep, mode]);


    // Reload all saved wizard data
    async function refreshWizard() {

        const savedLocationId = location?.id;

        if (!savedLocationId) {
            return null;
        }

        const data = await loadLocationWizard(savedLocationId);

        setWizardData(data);

        return data;
    }


    // Save location details
    async function handleSaveLocation(locationData) {

        setSaving(true);
        setError("");

        try {

            const savedLocation = await SaveLocation(
                location?.id || null,
                locationData
            );

            setWizardData(previous => ({
                ...previous,
                location: savedLocation
            }));

            return savedLocation;

        } catch (err) {

            setError(
                err.message ||
                "Failed to save location."
            );

            throw err;

        } finally {

            setSaving(false);

        }
    }


    // Move from Location Details to Pricing
    function handleLocationNext(savedLocation) {

        setWizardData(previous => ({
            ...previous,
            location: savedLocation
        }));

        setError("");
        setCurrentStep(1);

    }


    // Save pricing
    async function handleSavePricing(pricingData) {

        if (!location?.id) {
            throw new Error(
                "Please save the location first."
            );
        }

        setSaving(true);
        setError("");

        try {

            const savedPrices = await saveLocationPricing(
                location.id,
                pricingData,
                prices
            );

            return savedPrices;

        } catch (err) {

            setError(
                err.message ||
                "Failed to save pricing."
            );

            throw err;

        } finally {

            setSaving(false);

        }
    }


    // Reload pricing and determine the next incomplete step
    async function handlePricingNext(savedPrices) {

        setLoading(true);
        setError("");

        try {

            // Keep the saved pricing in state immediately
            setWizardData(previous => ({
                ...previous,
                prices: Array.isArray(savedPrices)
                    ? savedPrices
                    : previous.prices
            }));

            // Reload the backend data to calculate the correct next step
            const data = await loadLocationWizard(location.id);

            setWizardData(data);
            setCurrentStep(getStartingStep(data));

        } catch (err) {

            setError(
                err.message ||
                "Pricing was saved, but setup data could not be refreshed."
            );

        } finally {

            setLoading(false);

        }
    }


    // Save floor
    async function handleSaveFloor(floorData) {

        if (!location?.id) {
            throw new Error(
                "Please save the location first."
            );
        }

        setSaving(true);
        setError("");

        try {

            return await saveLocationFloor(
                location.id,
                floorData
            );

        } catch (err) {

            setError(
                err.message ||
                "Failed to create floor."
            );

            throw err;

        } finally {

            setSaving(false);

        }
    }


    // Reload saved floors after creating a floor
    async function handleFloorNext(savedFloor) {

        setLoading(true);
        setError("");

        try {

            const data = await loadLocationWizard(location.id);

             const selectedFloor = savedFloor?.id ? data.floors.find(item => item.id === savedFloor.id) : null;

              const floorToSelect = selectedFloor || data.floor || data.floors[0] || null;


              // Use the selected floor's saved slots.
            const selectedFloorSlots = floorToSelect ? data.allSlots.filter( slot => slot.floorId === floorToSelect.id): [];

             setWizardData({...data, floor: floorToSelect, slots: selectedFloorSlots });

            // Continue to the Slots step.
            setCurrentStep(3);

        } catch (err) {

            setError( err.message ||  "Failed to refresh floor data." );

        } finally {

            setLoading(false);

        }
    }


    // Generate slots
    async function handleSaveSlots(slotData) {

        setSaving(true);
        setError("");

        try {

            return await generateParkingSlots(
                slotData.floorId,
                slotData.request
            );

        } catch (err) {

            setError(
                err.message ||
                "Failed to generate slots."
            );

            throw err;

        } finally {

            setSaving(false);

        }
    }


    // Reload slots and determine the next step
    async function handleSlotsNext() {

        setLoading(true);
        setError("");

        try {

            const data = await refreshWizard();

            if (data) {
                setCurrentStep(getStartingStep(data));
            }

        } catch (err) {

            setError(
                err.message ||
                "Failed to refresh setup data."
            );

        } finally {

            setLoading(false);

        }
    }


    // Go to the previous step
    function handleBack() {

        setError("");

        setCurrentStep(previous =>
            Math.max(previous - 1, 0)
        );

    }


    // Cancel wizard
    function handleCancel() {

        navigate("/admin/locations");

    }


    // Finish wizard
    function handleFinish() {

        navigate("/admin/locations");

    }


    // Render current step
    function renderStepContent() {

        switch (currentStep) {

            case 0:

                return (
                    <LocationDetailsStep
                        savedLocation={location}
                        onSave={handleSaveLocation}
                        onNext={handleLocationNext}
                        saving={saving}
                    />
                );


            case 1:

                return (
                    <PricingStep
                        savedPrices={prices}
                        onSave={handleSavePricing}
                        onBack={handleBack}
                        onNext={handlePricingNext}
                        saving={saving}
                    />
                );


            case 2:

                return (
                    <FloorsStep
                        savedFloor={floors}
                        onSave={handleSaveFloor}
                        onBack={handleBack}
                        onNext={handleFloorNext}
                        saving={saving}
                    />
                );


            case 3:

                return (
                    <SlotsStep
                        floor={floor}
                        savedSlots={slots}
                        onSave={handleSaveSlots}
                        onBack={handleBack}
                        onNext={handleSlotsNext}
                        saving={saving}
                    />
                );


            case 4:

                return (
                    <ReviewStep
                        location={location}
                        prices={prices}
                        floor={floors}
                        slots={allSlots}
                        onBack={handleBack}
                        onFinish={handleFinish}
                    />
                );


            default:

                return null;

        }
    }


    // Loading state
    if (loading) {

        return (
            <div className="container-fluid py-5 text-center">

                <div
                    className="spinner-border text-success"
                    role="status"
                >
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p className="text-muted mt-3">
                    Loading location setup...
                </p>

            </div>
        );

    }


    // Determine heading
    let heading = "Continue Location Setup";

    if (!locationId) {

        heading = "Add Parking Location";

    } else if (mode === "edit") {

        switch (requestedStep) {

            case "1":
                heading = "Edit Parking Location";
                break;

            case "2":
                heading = "Edit Parking Pricing";
                break;

            case "3":
                heading = "Manage Parking Floors";
                break;

            case "4":
                heading = "Manage Parking Slots";
                break;

            default:
                heading = "Edit Parking Setup";
        }

    }


    return (

        <div className="container-fluid py-4">

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">

                <div>

                    <h3 className="fw-bold mb-1">
                        {heading}
                    </h3>

                    <p className="text-muted mb-0">
                        Configure the location, pricing, floors and parking slots.
                    </p>

                </div>

                <Button
                    variant="secondary"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>

            </div>


            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    {error}
                </div>

            )}


            <Card className="mb-4">

                <div className="row g-3">

                    {steps.map((step, index) => (

                        <div
                            className="col"
                            key={step}
                        >

                            <div className="d-flex flex-column align-items-center text-center">

                                <div
                                    className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                                        index === currentStep
                                            ? "bg-success text-white"
                                            : index < currentStep
                                                ? "bg-success text-white"
                                                : "bg-light text-secondary border"
                                    }`}
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        fontWeight: 600
                                    }}
                                >
                                    {index + 1}
                                </div>


                                <span
                                    className={`small ${
                                        index === currentStep
                                            ? "fw-bold text-success"
                                            : "text-muted"
                                    }`}
                                >
                                    {step}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>


                <div
                    className="progress mt-4"
                    style={{ height: "5px" }}
                >

                    <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                            width: `${
                                (currentStep / (steps.length - 1)) * 100
                            }%`
                        }}
                        aria-valuenow={currentStep}
                        aria-valuemin={0}
                        aria-valuemax={steps.length - 1}
                    />

                </div>

            </Card>


            <Card>

                {renderStepContent()}

            </Card>

        </div>

    );

}


export default AddLocationWizard;
