
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelection";
import Card from "../common/Card";

function ReservationDetails({
  vehicles = [],
  vehicleId,
  setVehicleId,
  reservationDate,
  setReservationDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,})
   {
  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.id,
    label: `${vehicle.vehicleNumber} (${vehicle.vehicleType})`,
  }));

  const timeOptions = Array.from({ length: 24 }, (_, hour) => {
    const time = `${String(hour).padStart(2, "0")}:00`;

    return {
      value: time,
      label: time,
    };
  });

  return (
    <Card title="Reservation Details" className="mb-4">
      <FormSelect
        label="Your Vehicle"
        name="vehicleId"
        value={vehicleId}
        onChange={(event) => setVehicleId(event.target.value)}
        options={vehicleOptions}
        placeholder="Select your vehicle"
        required
      />

      <FormInput
        label="Reservation Date"
        name="reservationDate"
        type="date"
        value={reservationDate}
         onChange={(event) => setReservationDate(event.target.value)}
        required
      />

      <div className="row">
        <div className="col-md-6">
          <FormSelect
            label="Start Time"
            name="startTime"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            options={timeOptions}
            placeholder="Select start time"
            required
          />
        </div>

        <div className="col-md-6">
          <FormSelect
            label="End Time"
            name="endTime"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            options={timeOptions.filter(
              (option) => !startTime || option.value > startTime
            )}
            placeholder="Select end time"
            required
          />
        </div>
      </div>
    </Card>
  );
}

export default ReservationDetails;
