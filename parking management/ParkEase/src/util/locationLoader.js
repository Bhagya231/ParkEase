import { redirect } from "react-router-dom";
import api from "./api";

export async function locationLoader() 
{
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return redirect("/login");
  }

  if (role !== "CUSTOMER") {
    return redirect(role === "ADMIN" ? "/admin" : "/login");
  }

  try {
    const response = await api.get("/user/locations", {
                          params: {
                            page:0,
                            size:6,
                            filter: "Active"
                          } });

          console.log("Locations API response:", response.data);

            const res = response.data;

            

    return {
      locations: Array.isArray(res) ? res : res.content ?? res.data ?? []
    };

  } catch (error) {
    throw new Response(
      error.response?.data?.message ||"Failed to load parking locations.",
      {
        status: error.response?.status || 500,
      }
    );
  }
}


export async function locationDetailsLoader({ params }) {
  const response = await api.get(`/user/${params.locationId}`);

  return {
    location: response.data,
  };
}


