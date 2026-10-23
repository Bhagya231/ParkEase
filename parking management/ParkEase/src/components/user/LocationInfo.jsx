import Card from "../common/Card";

function LocationInfo({location,image})
{
     if (!location) {
        return null;
    }
    return (
        <Card className="border-0">
            <div className="row g-3 align-items-center">
                <div className="col-12 col-md-5">

                    {image ? (
                        <img src={image} alt={location.locationName} className="img-fluid rounded w-100" style={{height: "240px", objectFit: "cover"}}/>

                    ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: "240px" }} >
                            <span className="text-muted">
                                Parking Location
                            </span>

                        </div>
                    )}

                </div>

                <div className="col-12 col-md-7">
                    <h4>{location.locationName}</h4>
                    
                    <p className="text-muted mb-2">
                        {location.address}
                    </p>

                    <p className="mb-2">
                        <strong>Area:</strong> {location.area}
                    </p>

                    <p className="mb-2">
                        <strong>Opening time:</strong> {location.openTime}
                    </p>

                    <p className="mb-2">
                        <strong>Closing time:</strong> {location.closeTime}
                    </p>

                     <span className="badge text-bg-success">
                        {location.status || "ACTIVE"}
                    </span>


                </div>




            </div>

        </Card>
    )
}

export default LocationInfo;