
import api from "../api";
import { getLocations } from "./adminLocationLoader";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to load slot management data."
    );
}

export async function adminSlotLoader({ request }) {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;

        const locationId = params.get("locationId") || "";
        const floorId = params.get("floorId") || "";

        // Fetch parking locations
        const locationResponse = await getLocations({
            page: 0,
            size: 100,
            filter: "ALL"
        });

        const locations = locationResponse.content || locationResponse || [];

        // Fetch floors when a location is selected
        let floors = [];

        if (locationId) {
            const floorResponse = await api.get(
                `/admin/${locationId}/floors`,
                {
                    params: {
                        page: 0,
                        size: 100
                    }
                }
            );

            const floorData = floorResponse.data;
            floors = floorData.content || floorData || [];
        }

        // Fetch slots when a floor is selected
        let slots = [];

        const searchApplied = params.get("searchApplied") === "true";

        if (floorId && searchApplied) {
            const searchParams = {};

            const vehicleType = params.get("vehicleType");
            const slotType = params.get("slotType");
            const sectionName = params.get("sectionName");
            const slotStatus = params.get("slotStatus");
            const startTime = params.get("startTime");
            const endTime = params.get("endTime");

            if (vehicleType) {
                searchParams.vehicleType = vehicleType;
            }

            if (slotType) {
                searchParams.slotType = slotType;
            }

            if (sectionName) {
                searchParams.sectionName = sectionName;
            }

            if (slotStatus) {
                searchParams.slotStatus = slotStatus;
            }

            if (startTime) {
                searchParams.startTime = startTime;
            }

            if (endTime) {
                searchParams.endTime = endTime;
            }

            const slotResponse = await api.get( `/admin/floors/${floorId}/slots`,{ params: searchParams });

            slots = slotResponse.data || [];
        }

        return {
            locations,
            floors,
            slots,
            selectedLocationId: locationId,
            selectedFloorId: floorId,
            filters: {
                vehicleType: params.get("vehicleType") || "",
                slotType: params.get("slotType") || "",
                sectionName: params.get("sectionName") || "",
                slotStatus: params.get("slotStatus") || "",
                startTime: params.get("startTime") || "",
                endTime: params.get("endTime") || ""
            }
        };
    } catch (error) {
        throw new Response(getErrorMessage(error), {
            status: error.response?.status || 500
        });
    }
}
