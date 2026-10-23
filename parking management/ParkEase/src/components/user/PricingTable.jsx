import { useEffect, useState } from "react";
import api from "../../util/api";
import Button from "../common/Button";
import Card from "../common/Card";
import noPricingImage from "/Noparking.png";

const vehicleDetails = {
  CAR: {
    title: "Car",
    icon: "🚗",
    totalKey: "totalCarSlots",
    availableKey: "availableCarSlots",
  },
  BIKE: {
    title: "Bike",
    icon: "🏍️",
    totalKey: "totalBikeSlots",
    availableKey: "availableBikeSlots",
  },
  EV: {
    title: "EV",
    icon: "⚡",
    totalKey: "totalEvSlots",
    availableKey: "availableEvSlots",
  },
};

function PricingTable({ locationId, summary, pricingData, onEditPrice }) {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");

  const isAdmin = role === "ADMIN";
  const hasProvidedPricing = Array.isArray(pricingData);

  useEffect(() => {
    if (hasProvidedPricing) {
      setPrices(pricingData);
      setLoading(false);
      setError("");
      return;
    }

    let ignore = false;

    async function fetchPrices() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/user/locations/${locationId}/pricing`);

        const result = response.data;

        const priceList = Array.isArray(result)? result
          : result?.content ?? result?.data ?? [];

        if (!ignore) {
          setPrices(priceList);
        }
      } catch (e) {
        if (!ignore) {
          setError(
            e.response?.data?.message || "Failed to fetch parking prices.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    if (!locationId) {
      setPrices([]);
      setLoading(false);
      return;
    }

    fetchPrices();

    return () => {
      ignore = true;
    };
  }, [locationId, pricingData]);

  return (
    <Card
      title="Vehicle Availability & Pricing"
      description="Compare available parking slots and charges by vehicle type."
      className="border-0 shadow-sm mt-4"
    >
      {loading ? (
        <p className="text-muted mb-0">
          Loading parking prices...
        </p>
      ) : error ? (
        <div className="alert alert-danger mb-0">
          {error}
        </div>
      ) : prices.length === 0 ? (
       <div className="text-center py-4">
          <img
            src={noPricingImage}
            alt="No pricing information available"
            className="img-fluid mb-3"
            style={{
              maxWidth: "280px",
              width: "100%",
              height: "auto",
            }}
          />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="py-3">Vehicle</th>
                <th className="text-center py-3">
                  Slots (Available / Total)
                </th>
                <th className="text-end py-3">
                  Hourly Price
                </th>
                <th className="text-end py-3">
                  Overstay Price
                </th>
                {isAdmin && <th className="text-end py-3">Action</th>}
              </tr>
            </thead>

            <tbody>
              {prices.map((price) => {
                const vehicle = vehicleDetails[price.vehicleType];

                if (!vehicle) {
                  return null;
                }

                const total = summary?.[vehicle.totalKey] ?? 0;
                const available = summary?.[vehicle.availableKey] ?? 0;

                return (
                  <tr key={price.id}>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="fs-5">
                          {vehicle.icon}
                        </span>
                        <span className="fw-medium">
                          {vehicle.title}
                        </span>
                      </div>
                    </td>

                    <td className="text-center py-3">
                      <span className="fw-semibold text-success">
                        {available}
                      </span>
                      <span className="text-muted"> / {total}</span>
                      <div className="small text-muted">
                        Available / Total
                      </div>
                    </td>

                    <td className="text-end py-3">
                      <span className="fw-semibold text-success">
                        ₹{price.hourPrice}
                      </span>
                      <div className="small text-muted">
                        per hour
                      </div>
                    </td>

                    <td className="text-end py-3">
                      <span className="fw-semibold">
                        ₹{price.overstayPrice}
                      </span>
                      <div className="small text-muted">
                        per hour
                      </div>
                    </td>

                    
                    {isAdmin && (
                      <td className="text-end py-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditPrice?.(price)}
                        >
                          <i className="bi bi-pencil me-1" />
                          Edit
                        </Button>
                      </td>
                    )}

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default PricingTable;