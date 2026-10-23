
import { useEffect, useMemo, useState } from "react";
import { useLoaderData, useNavigate, Link } from "react-router-dom";

import { ChevronRight, Home } from "lucide-react";
import Img from "../../assets/airport.jpg"

import api from "../../util/api";
import Card from "../../components/common/Card";
import LocationSummary from "../../components/user/LocationSummary";
import FloorCardList from "../../components/admin/FloorCardList";
import FloorSectionsTable from "../../components/admin/FloorSectionTable";

function FloorManagement() {
    const { location, floors } = useLoaderData();
    const navigate = useNavigate();

    const [selectedFloor, setSelectedFloor] = useState( () => floors?.[0] ?? null);

  

    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [error, setError] = useState("");

      const handleSelectFloor = (floor) => {setSelectedFloor(floor);};

    // Keep the selected floor valid if the floor list changes.
    useEffect(() => {
        setSelectedFloor((currentFloor) => {
            if (!floors?.length) {
                return null;
            }

            return floors.find(
                (floor) => floor.id === currentFloor?.id
            ) ?? floors[0];
        });
    }, [floors]);

    // Load slots whenever the selected floor changes.
    useEffect(() => {
        if (!selectedFloor?.id) {
            setSlots([]);
            return;
        }

        let cancelled = false;

        async function loadSlots() {
            setLoadingSlots(true);
            setError("");
            setSlots([]);

            try {
                const response = await api.get(  `/admin/floors/${selectedFloor.id}/slots` );

                if (!cancelled) {
                    setSlots(response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setSlots([]);
                    setError( err.response?.data?.message ||  "Unable to load sections for this floor." );
                }
            } finally {
                if (!cancelled) {
                    setLoadingSlots(false);
                }
            }
        }

        loadSlots();

        return () => {
            cancelled = true;
        };
    }, [selectedFloor?.id]);

    // Group individual slots by section.
    const sections = useMemo(() => {
        const sectionMap = new Map();

        slots.forEach((slot) => {
            const sectionName = slot.sectionName;

            if (!sectionMap.has(sectionName)) {
                sectionMap.set(sectionName, {
                    sectionName,
                    vehicleType: slot.vehicleType,
                    slotType: slot.slotType,
                    totalSlots: 0,
                    availableSlots: 0,
                });
            }

            const section = sectionMap.get(sectionName);

            section.totalSlots += 1;

            if (slot.slotStatus === "AVAILABLE") {
                section.availableSlots += 1;
            }
        });

        return Array.from(sectionMap.values()).sort(
            (a, b) => a.sectionName.localeCompare(b.sectionName));
    }, [slots]);

    // Calculate totals across all floors.
    const floorSummaryItems = useMemo(() => [
        {
            title: "Total Floors",
            value: floors?.length ?? 0,
            icon: "🏢",
        },
        {
            title: "Total Slots",
            value: floors?.reduce(
                (total, floor) =>
                    total + (floor.totalSlots ?? 0),
                0
            ) ?? 0,
            icon: "🅿️",
        },
        {
            title: "Available Slots",
            value: floors?.reduce(
                (total, floor) =>
                    total + (floor.availableSlots ?? 0),
                0
            ) ?? 0,
            icon: "✅",
        },
    ], [floors]);

    function handleAddFloor() {
        // Connect to the floor creation flow later.
    }

    function handleEditFloor(floor) {
        // Connect to the floor edit flow later.
        console.log("Edit floor:", floor);
    }

    function handleDeactivateFloor(floor) {
        // Connect to the deactivate flow later.
        console.log("Deactivate floor:", floor);
    }

    function handleViewSlots(floor, section) {
        navigate( `/admin/locations/${location.id}/floors/${floor.id}/slots?sectionName=${encodeURIComponent( section.sectionName )}`);
    }

    return (
        <div className="container-fluid py-3">

            {/* Breadcrumb Navigation */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb align-items-center mb-0">
                    <li className="breadcrumb-item">
                        <Link to="/admin" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
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
                            to={`/admin/locations/${location.id}`}
                            className="text-decoration-none text-muted"
                        >
                            {location.locationName}
                        </Link>
                    </li>

                     <li className="d-flex align-items-center mx-2">
                        <ChevronRight size={14} className="text-muted" />
                    </li>

                    <li  className="breadcrumb-item active d-inline-flex align-items-center gap-1" aria-current="page">
                        Floors
                    </li>
                </ol>
            </nav>
           <Card className="mb-4 border-0 shadow-sm">
                <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                        <h4 className="mb-1">
                            {location.locationName}
                        </h4>

                        <p className="text-muted mb-2">
                            <i className="bi bi-geo-alt-fill text-success me-2" />
                            {location.address}, {location.area}
                        </p>

                            <small className="text-muted">
                                <strong>Opening:</strong> {location.openTime}
                            </small>

                            <p><small className="text-muted">
                                <strong>Closing:</strong> {location.closeTime}
                            </small></p>

                            
                        
                        <p>
                                <span
                                className={`badge ${
                                    location.status === "ACTIVE"
                                        ? "bg-success"
                                        : "bg-secondary"
                                }`}
                            >
                                {location.status}
                            </span>
                            </p>
                    </div>

                   <img src={Img} alt="location image" width="250" height= "200" />
                </div>
            </Card>

            <LocationSummary
                summary={floorSummaryItems}
                title="Location Overview"
            />

            <FloorCardList
                floors={floors}
                selectedFloorId={selectedFloor?.id}
                onSelectFloor={handleSelectFloor}
                onAddFloor={handleAddFloor}
                onEditFloor={handleEditFloor}
                onDeactivateFloor={handleDeactivateFloor}
            />

            <div className="mt-4">
                {loadingSlots && (
                    <p className="text-muted">
                        Loading sections...
                    </p>
                )}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <div className="mt-4">
                    {loadingSlots && (
                        <p className="text-muted mb-2">
                            Loading sections...
                        </p>
                    )}

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    
                    <FloorSectionsTable
                        floor={selectedFloor}
                        sections={sections}
                        onViewSlots={handleViewSlots}
                    />
                </div>
            </div>
        </div>
    );
}

export default FloorManagement;
