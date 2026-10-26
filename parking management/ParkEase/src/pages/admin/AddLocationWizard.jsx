import { useState, useEffect } from "react";
import { useNavigate, useParams,useSearchParams  } from "react-router-dom";

import Card from "../../components/common/Card";

import Button from "../../components/common/Button";


import LocationDetailsStep from "./locationWizard/LocationDetailsStep";
import PricingStep from "./locationWizard/PricingStep";
import FloorsStep from "./locationWizard/FloorStep";
import SlotsStep from "./locationWizard/SlotStep";
import ReviewStep from "./locationWizard/ReviewStep";


import { loadLocationWizard } from "../../util/locationWizardLoader";

import { SaveLocation, saveLocationPricing,saveLocationFloor,generateParkingSlots } from "../../util/LocationWizardActions";

const steps = ["Location Details","Pricing","Floors","Slots","Review",];

const initialData = {location: null,prices: [], floors:[],slots: [],allSlots:[]};



// Determine the first incomplete step
function getStartingStep(data) 
{
    const {location,prices = [],floors = [],floor,slots = [], allSlots = []} = data;

    // New location
    if (!location) {
        return 0;
    }

    // Pricing has not been configured
    if (prices.length === 0) {
        return 1;
    }

    // Check whether every existing slot has matching pricing
    const hasMissingPricing = allSlots.some(slot =>!prices.some(price => price.vehicleType === slot.vehicleType));

    if (hasMissingPricing) {
        return 1;
    }

    // No floor has been created
    if (floors.length === 0) {
        return 2;
    }

    // An existing floor has no slots yet
    if (!floor || slots.length === 0) {
        return 3;
    }

    // Setup appears complete
    return 4;
}

function AddLocationWizard() 
{
    const navigate = useNavigate();
    const { locationId } = useParams();

    

    const [wizardData, setWizardData] = useState(initialData);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();

    const requestedStep = searchParams.get("step");
    const mode = searchParams.get("mode");

    const initialStep = Number(searchParams.get("step")) || 0;

    const [currentStep, setCurrentStep] = useState(initialStep);

    

    const { location,prices,floors, slots} = wizardData;

    // Load existing setup when continuing an inactive location
    useEffect(() => {
        let isMounted = true;

        async function loadData() 
        {
            setLoading(true);
            setError("");

            try {
                const data = await loadLocationWizard(locationId || null);

                console.log("Wizard location ID:", locationId);
                console.log("Wizard loaded location:", data.location);

                if (!isMounted) 
                {
                    return;
                }

                setWizardData(data);

                if (mode === "edit" && requestedStep !== null) {
                    const stepNumber = Number(requestedStep);

                    if (stepNumber >= 1 && stepNumber <= steps.length) {
                        // URL uses 1-based step numbers; React state uses 0-based indexes.
                        setCurrentStep(stepNumber - 1);
                    } else {
                        setCurrentStep(getStartingStep(data));
                    }
                } else {
                    setCurrentStep(getStartingStep(data));
                }

            } catch (err) {
                if (isMounted) {
                    setError(err.message || "Failed to load setup data.");
                   
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => 
        {
            isMounted = false;
        };
    }, [locationId, requestedStep, mode]);


 async function refreshWizard() {
        if (!location?.id)
         {
            return;
        }

        const data = await loadLocationWizard(location.id);

        setWizardData(data);
        setCurrentStep(getStartingStep(data));
  }




  async function handleSaveLocation(locationData) 
  {
    setSaving(true); 
    setError("");

        try {
            const savedLocation = await SaveLocation(location?.id || null,locationData);

            setWizardData(previous => ({ ...previous, location: savedLocation}));

            return savedLocation;

        } catch (err) {
            setError(err.message || "Failed to save location.");
            throw err;

        } finally {
            setSaving(false);
        }
    }


     function handleLocationNext(savedLocation) {
        setWizardData(previous => ({ ...previous, location: savedLocation }));

        setCurrentStep(1);
    }


    async function handleSavePricing(pricingData)
     {
        if (!location?.id) {
            throw new Error("Please save the location first.");
        }

        setSaving(true);
        setError("");

        try {
            const savedPrices = await saveLocationPricing(location.id,pricingData,prices);
   

            return savedPrices;

        } catch (err) {
            setError(err.message || "Failed to save pricing.");
            throw err;

        } finally {
            setSaving(false);
        }
    }


    function handlePricingNext(savedPrices) {
        const updatedData = {...wizardData,prices: savedPrices};

        setWizardData(updatedData);
        setCurrentStep(getStartingStep(updatedData));
    }


    async function handleSaveFloor(floorData) 
    {
        if (!location?.id) {
            throw new Error("Please save the location first.");
        }

        setSaving(true);
        setError("");

        try {
            return await saveLocationFloor(location.id,floorData);

        } catch (err) {
            setError(err.message || "Failed to create floor.");
            throw err;

        } finally {
            setSaving(false);
        }
    }


    function handleFloorNext(savedFloor) {
        setWizardData(previous => ({ ...previous, floor: savedFloor,
            floors: [ ...previous.floors, savedFloor],slots: [] }));

        setCurrentStep(3);
    }



    async function handleSaveSlots(slotData) {
        setSaving(true);
        setError("");

        try {
            return await generateParkingSlots( slotData.floorId, slotData.request);

        } catch (err) {
            setError(err.message || "Failed to generate slots.");
            throw err;

        } finally {
            setSaving(false);
        }
    }


     async function handleSlotsNext() {
        setLoading(true);
        setError("");

        try {
            // Reload everything so we can find any remaining
            // floors without slots or missing pricing.
            await refreshWizard();

        } catch (err) {
            setError(err.message || "Failed to refresh setup data.");
        } finally {
            setLoading(false);
        }
    }

    function handleBack() {
        setError("");

        setCurrentStep(previous =>Math.max(previous - 1, 0));
    }

     function handleCancel() {
        navigate("/admin/locations");
    }
   

    function handleFinish() {
    
        navigate("/admin/locations");
    }

 

      

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

        )

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
            savedFloor={floors}
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
            slots={slots}
            onBack={handleBack}
            onFinish={handleFinish}
        />

        );

      default:
        return null;
    }
  }

   if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div  className="spinner-border text-primary" role="status">
    
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


  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">{locationId ? "Continue location Setup" : "Add Parking Location"}</h3>
          <p className="text-muted mb-0">
            Configure the location, pricing, floors and parking slots.
          </p>
        </div>

        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>


      {error && (
                <div  className="alert alert-danger"  role="alert">
                  {error}
                </div>
                
            )}


      <Card className="mb-4">
        <div className="row g-3">
          {steps.map((step, index) => (
            <div className="col" key={step}>
              <div className="d-flex flex-column align-items-center text-center">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                    index === currentStep ? "bg-primary text-white" : index < currentStep ? "bg-success text-white" : "bg-light text-secondary border"
                  }`}
                  style={{ width: "38px",height: "38px", fontWeight: 600,}}>
                  {index + 1}
                </div>

                <span
                  className={`small ${index === currentStep ? "fw-bold text-primary" : "text-muted"}`}>
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="progress mt-4" style={{ height: "5px" }}>
          <div className="progress-bar" role="progressbar" style={{width: `${(currentStep / (steps.length - 1)) * 100}%`}}
            
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