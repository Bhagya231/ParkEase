
import { useMemo, useState } from "react";
import { useLoaderData, useSearchParams,  Link } from "react-router-dom";
import {ChevronRight,Home,CarFront,CheckCircle2,Clock3,Ban,ParkingSquare,} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";

import FormSelect from "../../components/common/FormSelection";
import SummaryCard from "../../components/common/SummaryCard";
import SlotCardList from "../../components/common/SlotsCardList";
import SlotDetailsModal from "../../components/common/SlotDetailsModel";
import DeactivateConfirmationModal from "../../components/common/DeactivateConfirmationModal";

function SlotsPage() {
    const { slots = [], sectionName,  slotStatus = "",} = useLoaderData();

    const [searchParams, setSearchParams] = useSearchParams();

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
   

    const statusOptions = [
        { value: "", label: "All Statuses" },
        { value: "AVAILABLE", label: "Available" },
        { value: "RESERVED", label: "Reserved" },
        { value: "OCCUPIED", label: "Occupied" },
        { value: "UNAVAILABLE", label: "Unavailable" },
    ];
    
    console.log(statusOptions);

    const selectedSection = slots[0];


    const summaryItems = useMemo(() => [
        {
            title: "Total Slots",
            value: slots.length,
            icon: <ParkingSquare size={22} />,
        },
        {
            title: "Available",
            value: slots.filter(
                (slot) => slot.slotStatus === "AVAILABLE"
            ).length,
            icon: <CheckCircle2 size={22} />,
        },
        {
            title: "Reserved",
            value: slots.filter(
                (slot) => slot.slotStatus === "RESERVED"
            ).length,
            icon: <Clock3 size={22} />,
        },
        {
            title: "Occupied",
            value: slots.filter(
                (slot) => slot.slotStatus === "OCCUPIED"
            ).length,
            icon: <CarFront size={22} />,
        },
        {
            title: "Unavailable",
            value: slots.filter(
                (slot) => slot.slotStatus === "UNAVAILABLE"
            ).length,
            icon: <Ban size={22} />,
        },
    ], [slots]);


    function handleSlotClick(slot) {
        setSelectedSlot(slot);
        setShowSlotModal(true);
    }

    function handleCloseSlotModal() {
        setShowSlotModal(false);
        setSelectedSlot(null);
    }

    function handleOpenDeactivateModal() {
        setShowSlotModal(false);
        setShowDeactivateModal(true);
    }

    function handleCancelDeactivate() {
        setShowDeactivateModal(false);
        setShowSlotModal(true);
    }

   

    function handleStatusChange(event) {
        const selectedStatus = event.target.value;

        const nextParams = new URLSearchParams(searchParams);

        if (selectedStatus) {
            nextParams.set("slotStatus", selectedStatus);
        } else {
            nextParams.delete("slotStatus");
        }

        setSearchParams(nextParams);
    }

    return (
        <div className="container-fluid py-3">
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb align-items-center mb-0">
                    <li className="breadcrumb-item">
                        <Link
                            to="/admin"
                            className="text-decoration-none text-muted d-inline-flex align-items-center gap-1"
                        >
                            <Home size={16} />
                            Admin
                        </Link>
                    </li>

                    <li className="d-flex align-items-center mx-2">
                        <ChevronRight size={14} className="text-muted" />
                    </li>

                    <li className="breadcrumb-item">
                        <Link
                            to="/admin/locations"
                            className="text-decoration-none text-muted"
                        >
                            Locations
                        </Link>
                    </li>

                    <li className="d-flex align-items-center mx-2">
                        <ChevronRight size={14} className="text-muted" />
                    </li>

                    <li className="breadcrumb-item">
                        <Link
                            to={`/admin/locations/${window.location.pathname.split("/")[3]}/floors`}
                            className="text-decoration-none text-muted"
                        >
                            Floors
                        </Link>
                    </li>

                    <li className="d-flex align-items-center mx-2">
                        <ChevronRight size={14} className="text-muted" />
                    </li>

                    <li className="breadcrumb-item active">
                        Section {sectionName}
                    </li>
                </ol>
            </nav>

            <PageHeader
                title={`Section ${sectionName} — Slots`}
                subtitle="View parking slots and their current statuses."
            />

            <Card className="mb-4 border-0 shadow-sm">
                <div className="row g-3">
                    <div className="col-md-4">
                        <small className="text-muted d-block">
                            Section
                        </small>
                        <h6 className="fw-semibold mb-0">
                            {sectionName}
                        </h6>
                    </div>

                    <div className="col-md-4">
                        <small className="text-muted d-block">
                            Vehicle Type
                        </small>
                        <h6 className="fw-semibold mb-0">
                            {selectedSection?.vehicleType ?? "—"}
                        </h6>
                    </div>

                    <div className="col-md-4">
                        <small className="text-muted d-block">
                            Slot Type
                        </small>
                        <h6 className="fw-semibold mb-0">
                            {selectedSection?.slotType ?? "—"}
                        </h6>
                    </div>
                </div>
            </Card>

            <div className="row g-3 mb-4">
                {summaryItems.map((item) => (
                    <div
                        key={item.title}
                        className="col-6 col-md-4 col-xl"
                    >
                        <SummaryCard
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                        />
                    </div>
                ))}
            </div>

            <Card className="mb-4 border-0 shadow-sm">
                <div className="row align-items-end g-3">
                    

                    <div className="col-md-6">
                        <FormSelect
                            label="Slot Status"
                            name="slotStatus"
                            value={slotStatus}
                            onChange={handleStatusChange}
                            options={statusOptions}
                            
                            
                        />
                    </div>
                </div>
            </Card>

            <div className="mb-3">
                <h5 className="fw-bold mb-1">Parking Slots</h5>
                <p className="text-muted small mb-0">
                    Showing {slots.length} of {slots.length} slots
                </p>
            </div>

            <SlotCardList slots={slots} onSlotClick={handleSlotClick} />

            <SlotDetailsModal
                show={showSlotModal}
                slot={selectedSlot}
                onClose={handleCloseSlotModal}
                onEdit={(slot) => {
                    
                    console.log("Edit slot:", slot);
                }}
                onDeactivate={handleOpenDeactivateModal}
            />

            <DeactivateConfirmationModal
                show={showDeactivateModal}
                title="Deactivate Slot"
                itemName={selectedSlot?.slotNumber}
                message="Are you sure you want to make this parking slot unavailable?"
                onCancel={handleCancelDeactivate}
                onConfirm={() => {
                    // Connect the backend status-update API here.
                }}
            />
        </div>
    );
}

export default SlotsPage;
