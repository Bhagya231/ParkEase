
import api from "../api";

// Create a pricing record for a location
export async function createParkingPrice(locationId, priceData) {
  const response = await api.post(
    `/admin/locations/${locationId}/pricing`,
    priceData
  );

  
  return response.data;
}

// Fetch pricing records for a location
export async function getParkingPrices(locationId, page = 0, size = 20) {
  const response = await api.get(
    `/admin/locations/${locationId}/pricing`,
    {
      params: {
        page,
        size,
      },
    }
  );

  return response.data;
}

// Update an existing pricing record
export async function updateParkingPrice(pricingId, priceData) {
  const response = await api.put(
    `/admin/pricing/${pricingId}`,
    priceData
  );

  return response.data;
}
