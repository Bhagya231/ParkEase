import api from "./api";

export async function SlotsLoader({ params, request})
{
    const { floorId } = params;

    if (!floorId) {
        throw new Response("Parking floor ID is required.", {
            status: 400
        });
    }


   const url = new URL(request.url);
    const searchParams = new URLSearchParams();

    const sectionName = url.searchParams.get("sectionName");
    const slotStatus = url.searchParams.get("slotStatus");

    if (!sectionName) {
        throw new Response("Section name is required.", {status: 400});
    }

    searchParams.set("sectionName", sectionName);

    if (slotStatus)
    {
        searchParams.set("slotStatus", slotStatus);
    }


    try {
    const response = await api.get(`/admin/floors/${floorId}/slots`,{ params: searchParams } );

    return {
        slots: response.data,
        selectedFloorId: floorId,
        sectionName,
        slotStatus: slotStatus || ""
    };

    } catch (error) {
    console.error("Failed to load parking slots:", error);

    throw new Response(error.response?.data?.message || "Unable to load parking slots.",
        {status: error.response?.status || 500}
            
        
    );
}


}