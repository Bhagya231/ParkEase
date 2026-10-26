
import api from "./api";


function getErrorMessage(error) {
    return (error.response?.data?.message || error.response?.data?.error ||  error.message  );
}


export async function SaveLocation(locationId, locationData) {
  try {
    let response;

    if (locationId) {
      
      response = await api.put(`/admin/locations/${locationId}`, locationData);

    } else {
    
      response = await api.post("/admin/locations",locationData);
    }

    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Failed to save parking location:", error);

    throw new Error(
      error.response?.data?.message || "Failed to save parking location. Please try again."
        
    );
  }
}


export async function saveLocationPricing(locationId, prices,savedPrices = [])
{
    if (!locationId) 
    {
        throw new Error("Save the location before adding pricing.");
    }

    try {
        const results = [];

        for (const price of prices) 
        {
            const existingPrice = savedPrices.find( saved => saved.vehicleType === price.vehicleType);
        
            let response;

            if (existingPrice?.id) {
                
                response = await api.put(`/admin/pricing/${existingPrice.id}`,price);
             
            } else {
                
                response = await api.post(`/admin/locations/${locationId}/pricing`,price);
            }

            results.push(response.data);
        }

        return results;
    } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to save parking pricing."));
  
    }
}


export async function saveLocationFloor(locationId, floorData) 
{
    if (!locationId) {
        throw new Error("Save the location before creating a floor.");
    }

    try {
        const response = await api.post(`/admin/${locationId}/floors`,floorData);
    
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to create parking floor."));
      
    }
}


export async function generateParkingSlots(floorId, slotData) {
    if (!floorId) {
        throw new Error("Create a floor before generating slots.");
    }

    try {
        const response = await api.post(`/admin/floors/${floorId}/slots`,slotData);

        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to generate parking slots."));
    }
}
