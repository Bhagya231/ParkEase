
import SummaryCard from "../../../components/common/SummaryCard";

function LocationSummary({ locations = [] }) {
  const totalLocations = locations.length;

  const activeLocations = locations.filter(
    (location) => location.status === "ACTIVE"
  ).length;

  const inactiveLocations = locations.filter(
    (location) => location.status === "INACTIVE"
  ).length;

  const summaryItems = [
    {
      title: "Total Locations",
      value: totalLocations,
      icon: "📍",
    },
    {
      title: "Active Locations",
      value: activeLocations,
      icon: "✅",
    },
    {
      title: "Inactive Locations",
      value: inactiveLocations,
      icon: "⏸️",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {summaryItems.map((item) => (
        <div
          className="col-12 col-md-4"
          key={item.title}
        >
          <SummaryCard
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        </div>
      ))}
    </div>
  );
}

export default LocationSummary;
