
import { useEffect, useState } from "react";
import api from "../../util/api";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const initialForm = {
    vehicleNumber: "",
    vehicleType: "CAR",
};

function VehicleManagement() {
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    async function fetchVehicles() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/user/vehicles");

            setVehicles(
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.content || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load vehicles."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchVehicles();
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleAddVehicle(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        const vehicleNumber = form.vehicleNumber.trim().toUpperCase();

        if (!vehicleNumber) {
            setError("Please enter the vehicle number.");
            return;
        }

        setSaving(true);

        try {
            await api.post("/user/vehicles", {
                vehicleNumber,
                vehicleType: form.vehicleType,
            });

            setForm(initialForm);
            setShowForm(false);
            setMessage("Vehicle added successfully.");

            await fetchVehicles();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to add vehicle."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteVehicle(vehicle) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${vehicle.vehicleNumber}?`
        );

        if (!confirmed) return;

        setError("");
        setMessage("");
        setDeletingId(vehicle.id);

        try {
            await api.delete(`/user/vehicles/${vehicle.id}`);

            setVehicles((previous) =>
                previous.filter((item) => item.id !== vehicle.id)
            );

            setMessage("Vehicle deleted successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete vehicle."
            );
        } finally {
            setDeletingId("");
        }
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">My Vehicles</h2>
                    <p className="text-muted mb-0">
                        Add and manage your registered vehicles.
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={() => {
                        setError("");
                        setMessage("");
                        setShowForm((previous) => !previous);
                    }}
                >
                    {showForm ? "Cancel" : "+ Add Vehicle"}
                </Button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {message && (
                <div className="alert alert-success" role="status">
                    {message}
                </div>
            )}

            {showForm && (
                <Card title="Add Vehicle" className="mb-4">
                    <form onSubmit={handleAddVehicle}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label
                                    htmlFor="vehicleNumber"
                                    className="form-label"
                                >
                                    Vehicle Number
                                </label>

                                <input
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    className="form-control"
                                    placeholder="e.g. TS09AB1234"
                                    value={form.vehicleNumber}
                                    onChange={handleChange}
                                    maxLength={20}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label
                                    htmlFor="vehicleType"
                                    className="form-label"
                                >
                                    Vehicle Type
                                </label>

                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    className="form-select"
                                    value={form.vehicleType}
                                    onChange={handleChange}
                                >
                                    <option value="CAR">Car</option>
                                    <option value="BIKE">Bike</option>
                                    <option value="EV">Electric Vehicle</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-3">
                            <Button
                                type="submit"
                                variant="primary"
                                loading={saving}
                                disabled={saving}
                            >
                                Save Vehicle
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <Card title={`Registered Vehicles (${vehicles.length})`}>
                {loading ? (
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-success"
                            role="status"
                        />
                        <p className="text-muted mt-2 mb-0">
                            Loading vehicles...
                        </p>
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="bi bi-car-front fs-1 text-secondary" />
                        <h5 className="mt-3">No vehicles registered</h5>
                        <p className="text-muted">
                            Add a vehicle to make parking reservations.
                        </p>
                    </div>
                ) : (
                    <div className="row g-3">
                        {vehicles.map((vehicle) => (
                            <div
                                className="col-12 col-md-6 col-xl-4"
                                key={vehicle.id}
                            >
                                <div className="border rounded-3 p-3 h-100">
                                    <div className="d-flex justify-content-between align-items-start gap-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                className="bg-success bg-opacity-10 text-success rounded-3 p-3"
                                            >
                                                <i
                                                    className={`bi ${
                                                        vehicle.vehicleType === "BIKE"
                                                            ? "bi-bicycle"
                                                            : "bi-car-front"
                                                    } fs-3`}
                                                />
                                            </div>

                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    {vehicle.vehicleNumber}
                                                </h6>
                                                <span className="badge bg-light text-dark">
                                                    {vehicle.vehicleType}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            disabled={deletingId === vehicle.id}
                                            onClick={() =>
                                                handleDeleteVehicle(vehicle)
                                            }
                                        >
                                            {deletingId === vehicle.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

export default VehicleManagement;
