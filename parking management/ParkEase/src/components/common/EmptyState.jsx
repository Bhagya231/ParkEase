
function EmptyState({
  title = "No data available",
  message = "There is nothing to display here yet.",
}) {
  return (
    <div className="text-center py-5 px-3">
      <div
        className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-10"
        style={{ width: "100px", height: "100px" }}
      >
        <svg
          width="66"
          height="66"
          viewBox="0 0 66 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="12"
            y="8"
            width="42"
            height="50"
            rx="6"
            fill="#DDF3E5"
            stroke="#198754"
            strokeWidth="2"
          />
          <path
            d="M23 23H43M23 32H39M23 41H35"
            stroke="#198754"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="48"
            cy="47"
            r="12"
            fill="white"
            stroke="#198754"
            strokeWidth="2.5"
          />
          <path
            d="M44 47L47 50L53 43"
            stroke="#198754"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h6 className="fw-bold mb-2">{title}</h6>

      <p
        className="text-secondary mb-0 mx-auto"
        style={{ maxWidth: "360px" }}
      >
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
