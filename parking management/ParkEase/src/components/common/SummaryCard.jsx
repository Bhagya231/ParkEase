
function SummaryCard({ title, value, icon, description }) {
  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body d-flex align-items-center gap-3">
        {icon && (
          <div
            className="rounded-3 bg-success-subtle text-success d-flex align-items-center justify-content-center"
            style={{
              width: 48,
              height: 48,
              fontSize: 22,
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <div>
          <p className="text-secondary small mb-1">
            {title}
          </p>

          <div className="h4 fw-bold mb-0">
            {value ?? 0}
          </div>

          {description && (
            <small className="text-secondary">
              {description}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
