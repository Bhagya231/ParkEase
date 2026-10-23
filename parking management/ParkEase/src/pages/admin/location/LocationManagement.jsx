
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PageHeader from "../../../components/common/PageHeader";
import AlertMessage from "../../../components/common/AlertMessage";

import LocationSummary from "./LocationSummary";
import LocationSearchFilter from "./LocationSearchFilter";
import LocationTable from "./LocationTable";

import { getLocations} from "../../../util/admin/adminLocationLoader";

function getErrorMessage(error) {
  return error.message || "Something went wrong. Please try again.";
}

function LocationManagement() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState( searchParams.get("search") || "");

  const [filter, setFilter] = useState(searchParams.get("filter") || "ALL");
  const [page, setPage] = useState(Math.max(0, Number(searchParams.get("page") || 0)));

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const loadLocations = useCallback(async (currentPage = page) => {
    setLoading(true);
    setError("");

    try {
      const data = await getLocations({
        search: searchParams.get("search") || "",
        filter: searchParams.get("filter") || "ALL",
        page: currentPage,
        size: 10,
      });

      // Spring Page response
      setLocations(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      setLocations([]);
      setTotalPages(0);
      setTotalElements(0);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, searchParams]);

  useEffect(() => {
    loadLocations(page);
  }, [loadLocations, page]);

  function handleSearch() {
    setPage(0);

    setSearchParams({
      search: search.trim(),
      filter,
      page: "0",
    });
  }

  function handleReset() {
    setSearch("");
    setFilter("ALL");
    setPage(0);

    setSearchParams({
      search: "",
      filter: "ALL",
      page: "0",
    });
  }


    function handleView(location) {
    console.log("Selected location:", location);
    navigate(`/admin/locations/${location.id}`);
  }

   function handleContinueSetup(location) {
    navigate(`/admin/locations/${location.id}/setup`);
  }


  function handlePageChange(nextPage) {
    setPage(nextPage);

    setSearchParams({
      search: searchParams.get("search") || "",
      filter: searchParams.get("filter") || "ALL",
      page: String(nextPage),
    });
  }

  return (
    <div className="container-fluid py-4">
      <PageHeader
        title="Parking Location Management"
        subtitle="Create, search, and manage your parking locations."
        action={
          <button
            type="button"
            className="btn btn-success"
            onClick={() => navigate("/admin/locations/new")}
            
          >
            + Add Location
          </button>
        }
      />

      {error && (
        <AlertMessage
          type="danger"
          message={error}
          onClose={() => setError("")}
        />
      )}

      {success && (
        <AlertMessage
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      <LocationSummary locations={locations} />

      <LocationSearchFilter
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
          />
          <p className="text-secondary mt-3 mb-0">
            Loading parking locations...
          </p>
        </div>
      ) : locations.length === 0 ? (
          <LocationTable
            locations={locations}
            onView={handleView}
            onContinueSetup={handleContinueSetup}
          />
        ) : (
        <>
          <LocationTable
            locations={locations}
            onView={handleView}
            onContinueSetup={handleContinueSetup}
          />

          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
            <small className="text-secondary">
              Total locations: {totalElements}
            </small>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={page <= 0}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </button>

              <span className="small">
                Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default LocationManagement;
