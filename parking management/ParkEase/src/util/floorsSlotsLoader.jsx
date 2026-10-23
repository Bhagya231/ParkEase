import { redirect } from "react-router-dom";
import api from "../actions/api";

export async function floorsSlotsLoader({ params }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return redirect("/login");
  }

  if (role !== "CUSTOMER") {
    return redirect(role === "ADMIN" ? "/admin" : "/login");
  }

  try {
    const [locationResponse, floorsResponse, vehiclesResponse] =await Promise.all([
        api.get(`/user/${params.locationId}`),
        api.get(`/user/locations/${params.locationId}/floors`),
        api.get("/user/vehicles"),
      ]);

    const floorData = floorsResponse.data;
    const vehicleData = vehiclesResponse.data;

    return {
      location: locationResponse.data,
      floors: Array.isArray(floorData)
        ? floorData
        : floorData.content ?? floorData.data ?? [],
      vehicles: Array.isArray(vehicleData)
        ? vehicleData
        : vehicleData.content ?? vehicleData.data ?? [],
    };
  } catch (error) {
    throw new Response(
      error.response?.data?.message ||
        "Failed to load floors and vehicles.",
      { status: error.response?.status || 500 }
    );
  }
}