import Card from "../common/Card";

function LocationSummary({ summary, title = "Location Overview" }) {
  console.log(title , summary);
  const defaultSummaryItems = [
    {
      title: "Total Floors",
      value: summary?.floorCount,
      icon: "🏢",
    },
    {
      title: "Total Slots",
      value: summary?.totalSlots,
      icon: "🅿️",
    },
    {
      title: "Available Slots",
      value: summary?.availableSlots,
      icon: "✅",
    },
  ];


  const summaryItems = Array.isArray(summary) ? summary : defaultSummaryItems;

  return (
    <div className="mt-4">
      <h5 className="mb-3">{title}</h5>

      <div className="row g-3">
        {summaryItems.map((item) => (
          <div className="col-12 col-md-4" key={item.title}>
            <Card className="border-0 shadow-sm h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="fs-2">{item.icon}</div>

                <div>
                  <p className="text-muted mb-1">
                    {item.title}
                  </p>

                  <h3 className="mb-0">
                    {item.value ?? 0}
                  </h3>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LocationSummary;