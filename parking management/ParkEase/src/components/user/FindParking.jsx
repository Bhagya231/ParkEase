
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import api from "../../util/api";
import Card from "../common/Card";
import img from "../../assets/airport.jpg"

function FindParking() 
{
    const { locations: initialLocations = [] } = useLoaderData();

    const [locations, setLocations] = useState(initialLocations);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    async function fetchLocations(search = "") 
    {
        setLoading(true);
        setError("");
        

        try {
            const response = await api.get("/user/locations", {
                params: {
                    page,
                    size,
                    search: search.trim() || undefined,
                    filter: "ACTIVE"
                }
            });

            
            const result = response.data;

          

            const locationList = Array.isArray(result)
                ? result
                : Array.isArray(result.content)
                    ? result.content
                    : Array.isArray(result.data)
                        ? result.data
                        : [];

            setLocations(locationList);


           
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to fetch parking locations."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(event)
     {
        event.preventDefault();
        await fetchLocations(searchInput);
    }

    async function handleClear() {
        setSearchInput("");
        await fetchLocations("");
    }

    return (
        <div className="container-fluid py-3">
            <div className="mb-4">
                <h2>Find Parking</h2>
                <p className="text-muted">
                    Find a parking location for your vehicle.
                </p>
            </div>

            <form onSubmit={handleSearch} className="mb-4">
                <div className="d-flex gap-2 align-items-center">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by location name or area..."
                        value={searchInput}
                        onChange={(event) => setSearchInput(event.target.value) }
                    />

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                    >
                        Search
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleClear}
                        disabled={loading}
                    >
                        Clear
                    </button>
                </div>
            </form>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {loading ? (
                <p className="text-muted">Loading locations...</p>
            ) : locations.length === 0 ? (
                <div className="alert alert-info">
                    No active parking locations found.
                </div>
            ) : (
                <div className="row g-4">
                    {locations.map((location) => (
                        <div className="col-12 col-md-6 col-xl-4"
                            key={location.id}
                        >
                            <Card
                                title={location.locationName}
                                description={location.area}
                                image={img}
                                className="h-100 border-0 shadow-sm" >
                                    <button
                                        type="button"
                                        className="btn btn-success w-100"
                                        onClick={() => navigate(`/customer/locations/${location.id}`)}>
                                            View Details
                                    </button>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FindParking;
