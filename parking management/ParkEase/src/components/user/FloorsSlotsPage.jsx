
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../util/api";

import LocationHeader from "./LocationHeader";
import ReservationDetails from "./ReservationDetails";

import SlotGrid from "./SlotGrid";
import BookingSummary from "./BookingSummary";
import FloorSelector from "../common/FloorSelector";


function getList(responseData) {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  return Array.isArray(responseData?.content)
    ? responseData.content
    : [];
}


function getCurrentDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDefaultTimes() {
    const now = new Date();

    // Round up to the next 30-minute interval.
    now.setSeconds(0, 0);

    const minutes = now.getMinutes();
    now.setMinutes(minutes === 0 ? 0 : minutes <= 30 ? 30 : 60);

    // If already exactly on a 30-minute interval, keep that time.
    const currentMinutes = new Date().getMinutes();
    if (currentMinutes % 30 === 0) {
        now.setMinutes(currentMinutes);
    }

    const startTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const end = new Date(now);
    end.setHours(end.getHours() + 1);

    const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;

    return { startTime, endTime };
}

function FloorsSlotsPage()
 {
  const { locationId } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [floors, setFloors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [prices, setPrices] = useState([]);

  const [vehicleId, setVehicleId] = useState("");
  const defaultTimes = getDefaultTimes();

  const [reservationDate, setReservationDate] = useState(getCurrentDate());
  const [startTime, setStartTime] = useState(defaultTimes.startTime);
  const [endTime, setEndTime] = useState(defaultTimes.endTime);
  const [floorId, setFloorId] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");

  // Load location, vehicles, floors and prices.
  useEffect(() => {
    let cancelled = false;

    async function loadPageData() {
      setLoadingDetails(true);
      setError("");

      try {
        const [
          locationResponse,
          vehicleResponse,
          floorResponse,
          priceResponse,] = await Promise.all([
          api.get(`/user/${locationId}`),
          api.get("/user/vehicles"),
          api.get(`/user/locations/${locationId}/floors`),
          api.get(`/user/locations/${locationId}/pricing`),
        ]);

        if (cancelled) return;

        const locationData = locationResponse.data;
        const vehicleData = vehicleResponse.data;
        const floorData = floorResponse.data;

        console.log("Floor API response:", floorResponse.data);

    
        const priceData = Array.isArray(priceResponse.data)
          ? priceResponse.data
          : priceResponse.data?.content || [];

        const vehicleList = Array.isArray(vehicleData) ? vehicleData : [];
        const floorList = Array.isArray(floorData) ? floorData : [];

        setLocation(locationData);
        setVehicles(vehicleList);
        setFloors(floorList);
        setPrices(priceData);

        // Select the first floor automatically.
        setFloorId(floorList[0]?.id || "");

        // Select the first vehicle automatically.
        setVehicleId(vehicleList[0]?.id || "");
        setSelectedSlotId("");
        setSlots([]);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Unable to load parking details. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDetails(false);
        }
      }
    }

    if (locationId) {
      loadPageData();
    } else {
      setError("Parking location ID is missing.");
      setLoadingDetails(false);
    }

    return () => {
      cancelled = true;
    };
  }, [locationId]);

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);

  const selectedFloor = floors.find((floor) => floor.id === floorId);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  const selectedPrice = prices.find((price) =>  price.vehicleType === selectedVehicle?.vehicleType);

  // Reset selected slot when reservation filters change.
  function clearSelectedSlot() {
    setSelectedSlotId("");
  }

  function handleVehicleChange(value) {
    setVehicleId(value);
    setSelectedSlotId("");
    setError("");
  }

  function handleFloorChange(value) {
    setFloorId(value);
    setSelectedSlotId("");
    setError("");
  }

  function handleDateChange(value) {
    setReservationDate(value);
    setSelectedSlotId("");
    setError("");
  }

  function handleStartTimeChange(value) {
    setStartTime(value);

    if (endTime && value >= endTime) {
      setEndTime("");
    }

    setSelectedSlotId("");
    setError("");
  }

  function handleEndTimeChange(value) {
    setEndTime(value);
    setSelectedSlotId("");
    setError("");
  }

  // loading slots based n floor,vehicle and time
  useEffect(() => {
    let cancelled = false;

    async function loadSlots() {
      setSlots([]);
      setSelectedSlotId("");
      setLoadingSlots(false);

      if (!locationId ||
        !floorId ||
        !selectedVehicle ||
        !reservationDate ||
        !startTime ||
        !endTime ||
        startTime >= endTime) {
        return;
      }

      setLoadingSlots(true);
      setError("");

      try {
        const params = {
          vehicleType: selectedVehicle.vehicleType,
          startTime: `${reservationDate}T${startTime}:00`,
          endTime: `${reservationDate}T${endTime}:00`,
        };


        console.log("Location ID:", locationId);
        console.log("Floor ID:", floorId);
        console.log("Vehicle:", selectedVehicle);
        console.log("Date:", reservationDate);
        console.log("Start:", startTime);
        console.log("End:", endTime);

        const response = await api.get(
          `/user/${locationId}/floors/${floorId}/slots`,{ params } );

        console.log("Slots response:", response.data);

        if (!cancelled) {
          setSlots(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setSlots([]);
          setError( err.response?.data?.message || "Unable to load parking slots.");
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
  }, [locationId,floorId,selectedVehicle,reservationDate,startTime,endTime, ]);

  function handleContinue() {
    setError("");

    if (!selectedVehicle) {
      setError("Please select your vehicle.");
      return;
    }

    if (!reservationDate || !startTime || !endTime) {
      setError("Please select a reservation date and time.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be later than start time.");
      return;
    }

    if (!selectedFloor) {
      setError("Please select a parking floor.");
      return;
    }

    if (!selectedSlot || selectedSlot.slotStatus !== "AVAILABLE") {
      setError("Please select an available parking slot.");
      return;
    }

    if (!selectedPrice) {
      setError(
        "Pricing is not available for your selected vehicle type."
      );
      return;
    }

    const duration = (new Date(`2000-01-01T${endTime}`) -new Date(`2000-01-01T${startTime}`)) / (1000 * 60 * 60);

    if (duration <= 0) {
      setError("Please select a valid reservation duration.");
      return;
    }

    const hourlyPrice = Number(selectedPrice.hourPrice);

    if (!Number.isFinite(hourlyPrice) || hourlyPrice < 0) {
      setError("The parking price is invalid.");
      return;
    }

    navigate("/customer/reservations/confirm", {
      state: {
        locationId,
        locationName: location.locationName,
        locationArea: location.area,
        vehicleId: selectedVehicle.id,
        vehicleNumber: selectedVehicle.vehicleNumber,
        vehicleType: selectedVehicle.vehicleType,
        floorId: selectedFloor.id,
        floorName: selectedFloor.floorName,
        slotId: selectedSlot.id,
        slotNumber: selectedSlot.slotNumber,
        reservationDate,
        startTime,
        endTime,
        hourlyPrice,
        estimatedPrice: duration * hourlyPrice,
      },
    });
  }

  if (loadingDetails) {
    return (
      <div className="container-fluid py-5 text-center">
        <div
          className="spinner-border text-success"
          role="status"
        >
          <span className="visually-hidden">
            Loading parking details...
          </span>
        </div>

        <p className="text-secondary mt-3 mb-0">
          Loading parking details...
        </p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger" role="alert">
          {error || "Parking location not found."}
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/customer/find-parking")}
        >
          Back to Locations
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-lg-4 py-4">

      {/* 1. Location name, area and address */}
      <LocationHeader location={location} />

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {vehicles.length === 0 && (
        <div className="alert alert-warning" role="alert">
          You haven't registered a vehicle yet. Please add a
          vehicle before making a reservation.
        </div>
      )}

      {/* 2. Reservation form, floor, slots and summary */}
      <div className="row g-4 align-items-start">

        {/* Main content */}
        <div className="col-12 col-xl-8">

          {/* Vehicle, date and timings */}
          <ReservationDetails
            vehicles={vehicles}
            vehicleId={vehicleId}
            setVehicleId={handleVehicleChange}
            reservationDate={reservationDate}
            setReservationDate={handleDateChange}
            startTime={startTime}
            setStartTime={handleStartTimeChange}
            endTime={endTime}
            setEndTime={handleEndTimeChange}
          />

          {/* Floor selection */}
          <FloorSelector
            floors={floors}
            floorId={floorId}
            setFloorId={handleFloorChange}
          />

          {/* Parking slots */}
          <SlotGrid
            slots={slots}
            selectedSlotId={selectedSlotId}
            setSelectedSlotId={setSelectedSlotId}
            loading={loadingSlots}
          />

        </div>

        {/* Booking summary */}
        <div className="col-12 col-xl-4">
          <div className="position-sticky" style={{ top: "1rem" }}>
            <BookingSummary
              locationName={location.locationName}
              vehicle={selectedVehicle}
              floor={selectedFloor}
              slot={selectedSlot}
              reservationDate={reservationDate}
              startTime={startTime}
              endTime={endTime}
              hourlyPrice={selectedPrice?.hourPrice}
              onContinue={handleContinue}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default FloorsSlotsPage;
