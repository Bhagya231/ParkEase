
import { Form , useActionData, useLoaderData, useNavigate, useNavigation} from "react-router-dom";


import PageHeader from "../../components/common/PageHeader";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { formatDateTime } from "../../util/formateDate";

function ReservationDetails()
{
    const { reservation } = useLoaderData();
    const actionData = useActionData();
    const navigation = useNavigation();
    const navigate = useNavigate();

     const isSubmitting = navigation.state === "submitting";

    const statusClasses = {
        RESERVED: "bg-success-subtle text-success",
        CANCELLED: "bg-danger-subtle text-danger",
        EXPIRED: "bg-secondary-subtle text-secondary",
        COMPLETED: "bg-primary-subtle text-primary"
    };

      function Detail({ label, value }) {
        return (
            <div className="col-md-6 col-lg-4">
                <div className="text-muted small mb-1">{label}</div>
                <div className="fw-medium text-break">{value || "-"}</div>
            </div>
        );
    }



    return (
        <div className="container-fluid py-3">
            <PageHeader
                title="Reservation Details"
                description="Review the reservation and record vehicle entry."
            />

            {actionData?.success === false && (
                <div className="alert alert-danger py-2 mb-3">
                    {actionData.message}
                </div>
            )}


            <Card title="Reservation Details">
                {/* Reservation Information */}
                <section className="mb-3">
                    <h6 className="fw-semibold mb-3">
                        Reservation Information
                    </h6>

                    <div className="row g-3">
                        <Detail label="Reservation Number"  value={reservation.reservationNumber} />
                            
            

                        <div className="col-md-6 col-lg-4">
                            <div className="text-muted small mb-1">
                                Reservation Status
                            </div>
                            <span
                                className={`badge ${statusClasses[reservation.reservationStatus] || "bg-light text-dark"}`}
                            >
                                {reservation.reservationStatus || "-"}
                            </span>
                        </div>

                        <Detail label="Created At" value={formatDateTime(reservation.createdAt)} />
              
                    </div>
                </section>

                <hr className="my-3" />

                {/* Parking Information */}
                <section className="mb-3">
                    <h6 className="fw-semibold mb-3">
                        Parking Information
                    </h6>

                    <div className="row g-3">
                        <Detail label="Parking Location"  value={reservation.locationName} />

                        <Detail label="Floor" value={reservation.floorName}/>

                        <Detail label="Slot Number" value={reservation.slotNumber}/>
                              
                    </div>
                </section>

                <hr className="my-3" />

                {/* Vehicle Information */}
                <section className="mb-3">
                    <h6 className="fw-semibold mb-3">
                        Vehicle Information
                    </h6>

                    <div className="row g-3">
                        <Detail label="Vehicle Number" value={reservation.vehicleNumber} />                          

                        <Detail  label="Vehicle Type"  value={reservation.vehicleType} />             
                    </div>
                </section>

                <hr className="my-3" />

                {/* Reservation Timing */}
                <section>
                    <h6 className="fw-semibold mb-3">
                        Reservation Timing
                    </h6>

                    <div className="row g-3">
                        <Detail label="Start Time" value={formatDateTime(reservation.startTime)} />      
           
                        <Detail label="End Time" value={formatDateTime(reservation.endTime)} />
                            
                    </div>
                </section>
            </Card>

             <div className="d-flex justify-content-end gap-2 mt-3">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>

                {reservation.reservationStatus === "RESERVED" && (
                    <Form method="post">
                        <input
                            type="hidden"
                            name="reservationId"
                            value={reservation.id}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            {isSubmitting
                                ? "Processing..."
                                : "Vehicle Entry"}
                        </Button>
                    </Form>
                )}
            </div>



             
                
        </div>





 
    );


}


export default ReservationDetails;
