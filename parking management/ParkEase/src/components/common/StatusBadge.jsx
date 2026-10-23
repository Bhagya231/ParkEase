
function StatusBadge({ status }) {
  const normalized = String(status || "UNKNOWN").toUpperCase();

  const classByStatus = {
    ACTIVE: "text-bg-success",
    AVAILABLE: "text-bg-success",
    SUCCESSFUL: "text-bg-success",

    INACTIVE: "text-bg-secondary",
    UNAVAILABLE: "text-bg-secondary",
    CANCELLED: "text-bg-secondary",

    RESERVED: "text-bg-warning",
    PENDING: "text-bg-warning",

    OCCUPIED: "text-bg-danger",
    FAILED: "text-bg-danger",

    EXPIRED: "text-bg-secondary",
    COMPLETED: "text-bg-primary",
  };

  const badgeClass =
    classByStatus[normalized] || "text-bg-light";

  return (
    <span className={`badge ${badgeClass}`}>
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

export default StatusBadge;
