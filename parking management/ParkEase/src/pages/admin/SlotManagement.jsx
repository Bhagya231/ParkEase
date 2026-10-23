// import { useEffect, useState } from "react";
// import { useFetcher, useLoaderData, useRevalidator, useSearchParams } from "react-router-dom";

// import PageHeader from "../../components/common/PageHeader";
// import AlertMessage from "../../components/common/AlertMessage";
// import SlotForm from "../../components/adminSlots/SlotForm";
// import SlotFilter from "../../components/adminSlots/SlotFilter";
// import SlotTable from "../../components/adminSlots/SlotTable";
// import Button from "../../components/common/Button";


// function SlotManagement()
// {
//     const { locations, floors,slots, selectedLocationId,  selectedFloorId, filters} = useLoaderData();

//     const fetcher = useFetcher();
//     const revalidator = useRevalidator();
//     const [searchParams, setSearchParams] = useSearchParams();

//     const searchApplied = searchParams.get("searchApplied") === "true";

//     const [myFilters, setMyFilters] = useState(filters);
//     const [selectedSlot, setSelectedSlot] = useState(null);
//     const [message, setMessage] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     const isSubmitting = fetcher.state !== "idle";

//         useEffect(() => {
//         setMyFilters(filters);
//     }, [filters]);

//     useEffect(() => {
//         if (!fetcher.data) {
//             return;
//         }

//         if (fetcher.data.success) {
//             setMessage({
//                 type: "success",
//                 text: fetcher.data.success
//             });

//             setSelectedSlot(null);
//             revalidator.revalidate();
//         } else if (fetcher.data.error) {
//             setMessage({
//                 type: "danger",
//                 text: fetcher.data.error
//             });
//         }
//     }, [fetcher.data]);


//       function handleLocationChange(locationId) 
//       {
//         const params = new URLSearchParams();

//         if (locationId) 
//         {
//             params.set("locationId", locationId);
//         }

//        setShowForm(false);
//         setSelectedSlot(null);
//         setMessage(null);

//         setMyFilters({
//             vehicleType: "",
//             slotType: "",
//             sectionName: "",
//             slotStatus: "",
//             startTime: "",
//             endTime: ""
//         });

//         setSearchParams(params);
//     }

//      function handleFloorChange(floorId) {
//         const params = new URLSearchParams();

//         if (selectedLocationId)
//         {
//             params.set("locationId", selectedLocationId);
//         }

//         if (floorId) 
//         {
//             params.set("floorId", floorId);
//         }

//         setShowForm(false);
//         setSelectedSlot(null);
//         setMessage(null);
//         setSearchParams(params);
//     }

//      function handleFilterChange(name, value) {
//         setMyFilters((previous) => ({
//             ...previous,
//             [name]: value
//         }));
//     }


//     function handleApplyFilters() {
//         if (!selectedFloorId) {
//             setMessage({type: "warning", text: "Please select a location and floor first."});
//             return;
//         }

//         if ( myFilters.startTime && myFilters.endTime && myFilters.startTime >= myFilters.endTime)
//              {
//             setMessage({type: "danger",
//                 text: "End time must be later than start time."
//             });
//             return;
//         }

//         const params = new URLSearchParams();

//         params.set("locationId", selectedLocationId);
//         params.set("floorId", selectedFloorId);
//         params.set("searchApplied", "true");

//         Object.entries(myFilters).forEach(([key, value]) => {
//             if (value) {
//                 params.set(key, value);
//             }
//         });

//         setShowForm(false);

//         setSelectedSlot(null);
//         setMessage(null);
//         setSearchParams(params);
//     }

//      function handleResetFilters() {
//         setMyFilters({
//             vehicleType: "",
//             slotType: "",
//             sectionName: "",
//             slotStatus: "",
//             startTime: "",
//             endTime: ""
//         });


//          const params = new URLSearchParams();

//         if (selectedLocationId) {
//             params.set("locationId", selectedLocationId);
//         }

//         if (selectedFloorId) {
//             params.set("floorId", selectedFloorId);
//         }

//         setShowForm(false);
//         setSelectedSlot(null);
//         setMessage(null);
//         setSearchParams(params);
//     }


//      function handleFormSubmit(payload) {
//         setMessage(null);

//         fetcher.submit(payload, {
//             method: "post",
//             encType: "application/json"
//         });
//     }


//      function handleStatusChange(slot, status)
//       {
//         const actionText = status === "AVAILABLE" ? "make this slot available"
//                 : "make this slot unavailable";

//         if (!window.confirm(`Are you sure you want to ${actionText}?`)) {
//             return;
//         }

//         setMessage(null);

//         fetcher.submit(
//             {
//                 intent: "status",
//                 slotId: slot.id,
//                 status
//             },
//             {
//                 method: "post",
//                 encType: "application/json"
//             }
//         );
//     }

//  return (
//         <div className="container-fluid py-3">
//             <PageHeader
//                 title="Slot Management"
//                 description="Manage parking slots by location and floor."
//             />

//             {message && (
//                 <AlertMessage
//                     type={message.type}
//                     message={message.text}
//                 />
//             )}

//             <SlotFilter
//                 locations={locations}
//                 floors={floors}
//                 selectedLocationId={selectedLocationId}
//                 selectedFloorId={selectedFloorId}
//                 filters={myFilters}
//                 onLocationChange={handleLocationChange}
//                 onFloorChange={handleFloorChange}
//                 onFilterChange={handleFilterChange}
//                 onApply={handleApplyFilters}
//                 onReset={handleResetFilters}
//             />

//             {searchApplied && selectedFloorId && (
//                 <>
//                     <div className="d-flex justify-content-between align-items-center my-4">
//                         <h5 className="mb-0">
//                             Parking Slots
//                         </h5>

//                         <Button
//                             type="button"
//                             onClick={() => {
//                                 setSelectedSlot(null);
//                                 setShowForm(true);
//                                 setMessage(null);}}
//                         >
//                             Create Slots
//                         </Button>
//                     </div>

//                     {showForm && (
//                         <div className="mb-4">
//                             <SlotForm
//                                 floorId={selectedFloorId}
//                                 selectedSlot={selectedSlot}
//                                 onSubmit={handleFormSubmit}
//                                 onCancel={() => {
//                                     setShowForm(false);
//                                     setSelectedSlot(null);
//                                 }}
//                                 loading={isSubmitting}
//                             />
//                         </div>
//                     )}

//                     <SlotTable
//                         slots={slots}
//                         loading={revalidator.state !== "idle"}
//                         onEdit={(slot) => {
//                             setSelectedSlot(slot);
//                             setShowForm(true);
//                             setMessage(null);
//                         }}
//                         onStatusChange={handleStatusChange}
//                     />
//                 </>
//             )}
//         </div>
//     );






// }


// export default SlotManagement;