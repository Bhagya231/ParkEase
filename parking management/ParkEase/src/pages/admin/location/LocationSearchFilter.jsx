
function LocationSearchFilter({
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onSearch,
  onReset,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card border-0 shadow-sm mb-4"
    >
      <div className="card-body">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-6">
            <label
              htmlFor="locationSearch"
              className="form-label fw-semibold"
            >
              Search Locations
            </label>

            <input
              id="locationSearch"
              type="text"
              className="form-control"
              placeholder="Search by location name or area"
              value={search}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <label
              htmlFor="locationFilter"
              className="form-label fw-semibold"
            >
              Status
            </label>

            <select
              id="locationFilter"
              className="form-select"
              value={filter}
              onChange={(event) =>
                onFilterChange(event.target.value)
              }
            >
              <option value="ALL">All Locations</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success flex-grow-1"
              >
                Search
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LocationSearchFilter;
