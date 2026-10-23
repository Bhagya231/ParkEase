
function AlertMessage({type = "info",message, onClose,})
{

    if (!message) 
    {
        return null;
    }

  const allowedTypes = [ "success", "danger", "warning", "info",];

  const alertType = allowedTypes.includes(type)? type: "info";

  return (
    <div
      className={`alert alert-${alertType} alert-dismissible`}
      role="alert"
    >
      {message}

      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        />
      )}
    </div>
  );
}

export default AlertMessage;
