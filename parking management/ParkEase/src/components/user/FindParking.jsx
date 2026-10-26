
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import api from "../../util/api";
import Card from "../common/Card";
import img from "../../assets/airport.jpg"
import noLocationsImage from "/NoLocationParking.png"

function FindParking() 
{
    const { locations: initialLocations = [] } = useLoaderData();

    const [locations, setLocations] = useState(initialLocations);
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    async function fetchLocations(search = "",pageNumber = 0) 
    {
        setLoading(true);
        setError("");
        

        try {
            const response = await api.get("/user/locations", {
                params: {
                    page:pageNumber,
                    size:10,
                    search: search.trim() || undefined,
                    filter: "ACTIVE"
                }
            });

            
            const result = response.data;

          if(result && Array.isArray(result.content))
          {
                setLocations(result.content);
                setPage(result.number ?? pageNumber);
                setTotalPages(result.totalPages ?? 0);
          } else {
                const locationList = Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : [] ;

                setLocations(locationList);
                setPage(pageNumber);
                setTotalPages(totalPages);
          }

            


           
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch parking locations.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(event)
     {
        event.preventDefault();
        const searchValue = searchInput.trim();
        setSearch(searchValue);
        await fetchLocations(searchInput, 0);
    }

    async function handleClear() {
        setSearchInput("");
        setSearch("");
        await fetchLocations("",0);
        
    }

    async function handlePageChange(pageNumber)
    {
        if(pageNumber < 0 || pageNumber >= totalPages || loading)
        {
            return;
        }
        await fetchLocations(search,pageNumber);
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
                <div className="d-flex flex-column flex-sm-row gap-2">
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
                
                <div className=" text-center">
                          <img
                          src={noLocationsImage}
                          alt="No parking locations available"
                          className="img-fluid mb-3"
                          style={{
                            maxWidth: "440px",
                            maxHeight: "420px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
            ) : (
                <>
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


                    {totalPages >= 0 && (
                       
                        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 gap-sm-3 mt-4">
                            <button
                                className="btn btn-outline-success"
                                disabled={page === 0 || loading}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous
                            </button>

                            <span>
                                Page {page + 1} of {totalPages + 1 }
                            </span>

                            <button className="btn btn-outline-success" disabled={page >= totalPages -1 || loading}
                                        onClick={() => handlePageChange(page + 1)}>
                                
                                    Next
                            
                            </button>

                        </div>
                        
                    )}

                    </>
                   


            )}
        </div>
    );
}

export default FindParking;
