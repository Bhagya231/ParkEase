import { useLoaderData, useSearchParams } from "react-router-dom";
import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import ReservationTable from "../../components/admin/ReservationTable";
import ReservationFilters from "../../components/admin/reservationFilter";



function ReservationPage()
{
    const {reservations, locations =[], totalPages, totalElements, currentPage,pageSize } = useLoaderData();


    
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        status: searchParams.get("status") || "",
        locationId: searchParams.get("locationId") || ""
    });

     function handleFilterChange(name, value) {
        setFilters((previousFilters) => ({
            ...previousFilters,
            [name]: value
        }));
    }


     function handleSearch() {
        const params = new URLSearchParams(searchParams);

        params.delete("status");
        params.delete("locationId");
        params.set("page", "0");
        params.set("size", String(pageSize || 10));

        if (filters.status) {
            params.set("status", filters.status);
        }

        if (filters.locationId) {
            params.set("locationId", filters.locationId);
        }

        setSearchParams(params);
    }

     function handleReset() {
        setFilters({
            status: "",
            locationId: ""
        });

        setSearchParams({
            page: "0",
            size: String(pageSize || 10)
        });
    }




    function changePage(page) {
        const params = new URLSearchParams(searchParams);

        params.set("page", page);
        params.set("size", pageSize);

        setSearchParams(params);
    }

     function handleBackToFirstPage() {
        const params = new URLSearchParams(searchParams);

        params.set("page", "0");
        setSearchParams(params);
    }


    return (

        <div className="container-fluid py-4">
            <PageHeader
                title="Reservation Management"
                description="View and manage customer parking reservations."
            />

             <ReservationFilters
                filters={filters}
                locations={locations}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onReset={handleReset}
            />


            <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
                <div className="text-muted">
                    Total reservations: {totalElements}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToFirstPage}
                >
                    Refresh List
                </Button>
            </div>

            <ReservationTable reservations={reservations} />


             {totalPages > 0 && (
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-4">
                    <div className="text-muted">
                        Page {currentPage + 1} of {totalPages}
                    </div>

                    <div className="d-flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={currentPage === 0}
                            onClick={() => changePage(currentPage - 1)}
                        >
                            Previous
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => changePage(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>






    );

}


export default ReservationPage;

