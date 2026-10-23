
import api from "../util/api"

export async function FloorsLoader({ params})
{
    const { locationId }  = params;

     if (!locationId) {
        throw new Response("Parking location ID is required", {status: 400});
    }

    try{

         const [locationResponse, floorsResponse] = await Promise.all([
            api.get(`/admin/locations/${locationId}`),
            api.get(`/admin/${locationId}/floors`)]);


        return { 
            location: locationResponse.data,
            floors: floorsResponse.data
        };

    }catch (error) {
        console.error("Failed to load parking location and floors:", error);

        throw new Response( error.response?.data?.message || "Unable to load parking location and floors",
            { status: error.response?.status || 500}
            
        );
    }



}