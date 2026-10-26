 import api from "./api";


 function getList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    return [];
}



// Check whether every slot has matching vehicle pricing
function hasValidPricingForSlots(slots, prices)
 {
    return slots.every(slot => prices.some(price => price.vehicleType === slot.vehicleType));
}

// Check whether the location setup is complete
export function isSetupComplete({ floors = [], slots = [], prices = [] }) 
{
    if (floors.length === 0 || slots.length === 0) 
        {
        return false;
    }

    return hasValidPricingForSlots(slots, prices);
}

// Load data for a new or existing location
export async function loadLocationWizard(locationId = null) {

    
    const emptyData = { location: null, prices: [],floors: [],floor: null,slots: [],isSetupComplete: false,nextStep: 0};
       
  

    // No ID means Add Location
    if (!locationId) {
        return emptyData;
    }

    try {
        
        const [locationResponse,pricingResponse,floorsResponse] = await Promise.all([api.get(`/admin/locations/${locationId}`),

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

        
        const floorSlots = await Promise.all( floors.map(async floor => {const response = await api.get(`/admin/floors/${floor.id}/slots` );

                return {
                    floors,
                    slots: getList(response.data)
                };
            })
        );

        console.log("Location ID:", locationId);
        console.log("Location API response:", locationResponse.data);
        console.log("Location loaded:", location);

        

       
        const slots = floorSlots.flatMap(item => item.slots);

       
        const selectedFloorData = floorSlots.find(item => item.slots.length === 0) || floorSlots[0] || null;

        const floor = selectedFloorData?.floor || null;
        const selectedFloorSlots = selectedFloorData?.slots || [];

        
        const setupComplete = isSetupComplete({floors,slots, prices});

        
        let nextStep = 1;

        const hasPricingForSlots = hasValidPricingForSlots(slots, prices);

        if (floors.length === 0) {
            nextStep = 2; // Floors
        } else if (slots.length === 0) {
            nextStep = 3; // Slots
        } else if (!hasPricingForSlots) {
            nextStep = 1; // Pricing
        } else {
            nextStep = 4; // Review / Finish
        }

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
        console.error("Failed to load location wizard data:",error);

        throw new Error(error.response?.data?.message ||error.response?.data?.error || "Failed to load location setup data.");
            
  
    }
}