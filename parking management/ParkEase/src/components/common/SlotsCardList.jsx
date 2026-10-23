import SlotCard from "./SlotCard";


function SlotsCardList({ slots = [], loading = false, onSlotClick,})
{
     if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">
                        Loading slots...
                    </span>
                </div>

            </div>
        );
    }

     if (slots.length === 0) {
        return (
            <div className="text-center border rounded-3 bg-white py-5 px-3">
                <h6 className="fw-semibold">No slots found</h6>
                <p className="text-muted mb-0">
                    Try changing the slot number or status filter.
                </p>
            </div>
        );
    }

     return (
        <div className="row g-3">
            {slots.map((slot) => (
                <div
                    key={slot.id}
                    className="col-6 col-md-4 col-lg-3 col-xl-2"
                >
                    <SlotCard slot={slot} onClick={onSlotClick} />
                </div>
            ))}
        </div>
    );


}

export default SlotsCardList;