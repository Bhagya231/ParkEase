
import api from "../api";
import { getLocations } from "./adminLocationLoader";

function getErrorMessage(error) {
    return (
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to load pricing data."
    );
}

export async function adminPricingLoader({ request }) {
    try {
        const url = new URL(request.url);
        const params = url.searchParams;

        const locationId = params.get("locationId") || "";
        const page = Number(params.get("page") || 0);
        const size = 10;
        

        const locationResponse = await getLocations({
            page: 0,
            size: 100,
            filter: "ALL"
        });

        const locations =  locationResponse.content || locationResponse || [];

        const response = locationId ? await api.get( `/admin/locations/${locationId}/pricing`,
                  { params: { page, size } })
            : await api.get("/admin/pricing", { params: { page, size } });


             const pricingPage = response.data;

        return {
            locations,
            pricing: pricingPage.content || [],
            totalPages: pricingPage.totalPages || 0,
            totalElements: pricingPage.totalElements || 0,
            currentPage: pricingPage.number || 0,
            pageSize: pricingPage.size || size,
            selectedLocationId: locationId
        };

    } catch (error) 
    {
        throw new Response(getErrorMessage(error), {
            status: error.response?.status || 500});
    }

}
