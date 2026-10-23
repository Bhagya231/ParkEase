import api from "../api";

export async function adminLocationDetailsLoader({ params }) {
  const locationId = params.locationId;

console.log("Route params:", params);
console.log("Location ID:", locationId);

  try {
    
    const [locationResponse, pricingResponse] = await Promise.all([
      api.get(`/admin/locations/${locationId}`),
      api.get(`/admin/locations/${locationId}/pricing`, {
        params: {
          page: 0,
          size: 10,
        },
      }),
    ]);

    const locationResult = locationResponse.data;
    const pricingResult = pricingResponse.data;

    const location = locationResult?.data ?? locationResult;

    const prices = Array.isArray(pricingResult)
      ? pricingResult
      : pricingResult?.content ??
        pricingResult?.data?.content ??
        pricingResult?.data ??
        [];

    if (!location?.id) {
      throw new Error("Parking location was not found.");
    }

    return {location, prices,};
  } catch (error) {
    console.error("Failed to load parking location details:", error);

    throw new Response(
      error.response?.data?.message || "Failed to load parking location details.", { status: error.response?.status || 500 }
    );
  }
}