
import api from "./api";

// Get list from array or paginated response
function getList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    return [];
}


// Check whether every vehicle type used by slots has pricing
function hasValidPricingForSlots(slots, prices) {
    if (slots.length === 0 || prices.length === 0) {
        return false;
    }

    const pricedVehicleTypes = new Set(
        prices.map(price => price.vehicleType)
    );

    return slots.every(slot =>
        pricedVehicleTypes.has(slot.vehicleType)
    );
}


// Check whether location setup is complete
export function isSetupComplete({
    floors = [],
    slots = [],
    prices = [],
    floorSlots = []
}) {
    if (
        floors.length === 0 ||
        slots.length === 0 ||
        prices.length === 0
    ) {
        return false;
    }

    // Every floor must have at least one slot
    const everyFloorHasSlots = floorSlots.every(
        item => item.slots.length > 0
    );

    if (!everyFloorHasSlots) {
        return false;
    }

    // Every slot must have matching vehicle pricing
    return hasValidPricingForSlots(slots, prices);
}


// Load data for a new or existing location
export async function loadLocationWizard(locationId = null) {

    const emptyData = {
        location: null,
        prices: [],
        floors: [],
        floor: null,
        slots: [],
        allSlots: [],
        isSetupComplete: false,
        nextStep: 0
    };

    // No ID means Add Location
    if (!locationId) {
        return emptyData;
    }

    try {
        // Load location, pricing and floors
        const [
            locationResponse,
            pricingResponse,
            floorsResponse
        ] = await Promise.all([
            api.get(`/admin/locations/${locationId}`),

            api.get(`/admin/locations/${locationId}/pricing`, {
                params: {
                    page: 0,
                    size: 10
                }
            }),

            api.get(`/admin/${locationId}/floors`)
        ]);

        const location = locationResponse.data;
        const prices = getList(pricingResponse.data);
        const floors = getList(floorsResponse.data);

        // Load slots for every floor
        const floorSlots = await Promise.all(
            floors.map(async floor => {
                const response = await api.get(
                    `/admin/floors/${floor.id}/slots`
                );

                return {
                    floor,
                    slots: getList(response.data)
                };
            })
        );

        // Collect all slots from every floor
        const slots = floorSlots.flatMap(
            item => item.slots
        );

        // Find the first floor without slots.
        // If every floor has slots, select the first floor.
        const selectedFloorData =
            floorSlots.find(item => item.slots.length === 0) || floorSlots[0] ||null;

        const floor = selectedFloorData?.floor || null;
        const selectedFloorSlots = selectedFloorData?.slots || [];

        // Validate pricing against existing slot vehicle types
        const hasPricingForSlots = hasValidPricingForSlots(slots, prices);

        // Determine whether the entire setup is complete
        const setupComplete = isSetupComplete({
            floors,
            slots,
            prices,
            floorSlots
        });

        // Determine the first incomplete step
        let nextStep;

        if (prices.length === 0 || (slots.length > 0 && !hasPricingForSlots)) {
            
            nextStep = 1;
        } else if (floors.length === 0) {
            
            nextStep = 2;
        } else if ( floorSlots.some(item => item.slots.length === 0)) {
           
            nextStep = 3;
        } else {
            
            nextStep = 4;
        }

        console.log("Wizard location ID:", locationId);
        console.log("Loaded location:", location);
        console.log("Loaded prices:", prices);
        console.log("Loaded floors:", floors);
        console.log("Selected floor:", floor);
        console.log("All slots:", slots);
        console.log("Next wizard step:", nextStep);
        console.log("Setup complete:", setupComplete);

        return {
            location,
            prices,
            floors,
            floor,
            slots: selectedFloorSlots,
            allSlots: slots,
            isSetupComplete: setupComplete,
            nextStep
        };

    } catch (error) {
        console.error(
            "Failed to load location wizard data:",
            error
        );

        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Failed to load location setup data."
        );
    }
}
