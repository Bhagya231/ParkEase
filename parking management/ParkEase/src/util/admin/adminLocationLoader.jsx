
import api from "../api";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

// Get parking locations with search, status filter and pagination
export async function getLocations(params = {}) {
  try {
    const response = await api.get("/admin/locations", {
      params: {
        search: params.search || "",
        filter: params.filter || "ALL",
        page: params.page ?? 0,
        size: params.size ?? 10,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching parking locations:", error);
    throw new Error(getErrorMessage(error));
  }
}

// Create parking location
export async function createLocation(locationData) {
  try {
    const response = await api.post("/admin/locations", locationData);
    return response.data;
  } catch (error) {
    console.error("Error creating parking location:", error);
    throw new Error(getErrorMessage(error));
  }
}

// Get parking location by ID
export async function getLocationById(locationId) {
  try {
    const response = await api.get(`/admin/locations/${locationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching parking location:", error);
    throw new Error(getErrorMessage(error));
  }
}

// Update parking location
export async function updateLocation(locationId, locationData) {
  try {
    const response = await api.put(
      `/admin/locations/${locationId}`,
      locationData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating parking location:", error);
    throw new Error(getErrorMessage(error));
  }
}

// Activate or deactivate parking location
export async function updateLocationStatus(locationId, status) {
  try {
    const response = await api.patch(
      `/admin/locations/${locationId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating parking location status:", error);
    throw new Error(getErrorMessage(error));
  }
}
