
import api from "./api";

// Pricing 

export async function getPricing(locationId) {
    const response = await api.get(
        `/admin/locations/${locationId}/pricing`,
        { params: { page: 0, size: 100 } }
    );

    // Spring Page responses contain records inside content.
    return Array.isArray(response.data)
        ? response.data
        : response.data.content ?? [];
}

export async function createPrice(locationId, price) {
    const response = await api.post(
        `/admin/locations/${locationId}/pricing`,
        price
    );

    return response.data;
}

export async function updatePrice(priceId, price) {
    const response = await api.put(
        `/admin/pricing/${priceId}`,
        price
    );

    return response.data;
}

//  Floors 

export async function getFloors(locationId) {
    const response = await api.get(
        `/admin/${locationId}/floors`
    );

    return response.data;
}

export async function createFloor(locationId, floor) {
    const response = await api.post(
        `/admin/${locationId}/floors`,
        {
            floorName: floor.floorName,
            floorNumber: Number(floor.floorNumber)
        }
    );

    return response.data;
}

//  Slots

export async function getSlots(floorId) {
    const response = await api.get(
        `/admin/floors/${floorId}/slots`
    );

    return response.data;
}

export async function createSlots(floorId, request) {
    const response = await api.post(
        `/admin/floors/${floorId}/slots`,
        request
    );

    return response.data;
}
