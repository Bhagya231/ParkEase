import { useEffect, useState } from "react";
import { useFetcher, useLoaderData, useRevalidator, useSearchParams} from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import AlertMessage from "../../components/common/AlertMessage";
import Button from "../../components/common/Button";
import PricingFilter from "../../components/admin/PricingFilter";
import PricingForm from "../../components/admin/PricingForm";
import PricingTable from "../../components/admin/PricingTable";




function PricingManagement() 
{
    const {  locations, pricing,totalPages,totalElements, currentPage,selectedLocationId  } = useLoaderData();



    const fetcher = useFetcher();
    const revalidator = useRevalidator();
    const [, setSearchParams] = useSearchParams();

    const [selectedLocation, setSelectedLocation] = useState(selectedLocationId || "");
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState("");

    const isSaving = fetcher.state !== "idle";


    console.log("Pricing data:", pricing);
    console.log("Pricing count:", pricing?.length);
       
        
      useEffect(() => {
        setSelectedLocation(selectedLocationId || "");
    }, [selectedLocationId]);
        
        
     useEffect(() => {
        if (fetcher.state !== "idle" || !fetcher.data) {
            return;
        }

        if (fetcher.data.success) {
            setMessage(fetcher.data.success);
            setShowForm(false);
            setSelectedPrice(null);
            revalidator.revalidate();
        }
    }, [fetcher.state, fetcher.data]);

    function handleLocationChange(locationId) {
        setSelectedLocation(locationId);
        setMessage("");
    }

    function handleSearch() {
        if (!selectedLocation) {
            setMessage("Please select a parking location.");
            return;
        }

        setMessage("");
        setSelectedPrice(null);
        setShowForm(false);

        setSearchParams({
            locationId: selectedLocation,
            page: "0"
        });
    }

     function handleReset() {
        setSelectedLocation("");
        setSelectedPrice(null);
        setShowForm(false);
        setMessage("");
        setSearchParams({});
    }

    function handleCreate() 
    {
         if (!selectedLocationId) {
            setMessage("Select a parking location and click Search before creating pricing.");
            return;
        }
        setSelectedPrice(null);
        setShowForm(true);
        setMessage("");
    }

    function handleEdit(price) {
        setSelectedPrice(price);
        setShowForm(true);
        setMessage("");
    }

    function handleCancel() {
        setShowForm(false);
        setSelectedPrice(null);
    }
        
        
     function handleSubmit(formData) {
        setMessage("");

        fetcher.submit(
            {
                ...formData,
                locationId: selectedLocationId 
            },
            {
                method: "post",
                encType: "application/json"
            }
        );
    }
  
    function handlePageChange(page)
     {
        const params = { page: String(page) };

          if (selectedLocationId) 
            {
             params.locationId = selectedLocationId;
            }

            setSearchParams(params);
    }


    return (
        <div className="container-fluid">
            <PageHeader
                title="Pricing Management"
                description="Manage hourly and overstay prices for each vehicle type."
            />

            {message && (
                <AlertMessage message={message} type="success"/>
            )}

            {fetcher.data?.error && (
                <AlertMessage
                    message={fetcher.data.error}
                    type="danger"
                />
            )}

            <PricingFilter
                locations={locations}
                selectedLocationId={selectedLocation}
                onLocationChange={handleLocationChange}
                onSearch={handleSearch}
                onReset={handleReset}
            />

            <div className="d-flex justify-content-between align-items-center my-4">
                <div>
                    <h5 className="mb-1">
                        {selectedLocationId
                            ? "Location Pricing"
                            : "All Parking Pricing"}
                    </h5>

                    <small className="text-muted">
                        {totalElements} pricing record(s)
                    </small>
                </div>

                {selectedLocationId && !showForm && (
                    <Button type="button" onClick={handleCreate}>
                        Create Pricing
                    </Button>
                )}
            </div>

            {showForm  && (
                <div className="my-4">
                    <PricingForm
                        selectedPrice={selectedPrice}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={isSaving}
                    />
                </div>
            )}

            {!showForm && (
                <>
                    <PricingTable
                        pricing={pricing}
                        onEdit={handleEdit}
                    />

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center gap-3 my-4">
                            <Button
                                type="button"
                                variant="outline-secondary"
                                disabled={currentPage === 0}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </Button>

                            <span>
                                Page {currentPage + 1} of {totalPages}
                            </span>

                            <Button
                                type="button"
                                variant="outline-secondary"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
            </div>


    );
    }

              
   

export default PricingManagement;


