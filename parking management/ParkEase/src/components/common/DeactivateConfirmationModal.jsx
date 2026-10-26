
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

function DeactivateConfirmationModal({show, title = "Confirm Status Change", itemName,message,onCancel,onConfirm,loading = false,confirmText ="Confirm"})
{
    if (!show)
    {
        return null;
    }

    return (
        <div className="modal d-block" tabIndex="-1" role="dialog"  aria-modal="true" style={{ zIndex: 9999, backgroundColor: "rgba(0, 0, 0, 0.5)" }}  >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className="modal-title fw-semibold">
                            {title}
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCancel}
                            disabled={loading}
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body text-center px-4 py-4">
                        <div className="mb-3">
                            <AlertTriangle
                                size={48}
                                className="text-danger"
                            />
                        </div>

                        <h6 className="fw-semibold mb-2">
                            Are you sure?
                        </h6>

                        <p className="text-muted mb-2">
                            {message ||
                                "Are you sure you want to change this floor's status?"}
                        </p>

                        {itemName && (
                            <p className="fw-semibold mb-0">
                                {itemName}
                            </p>
                        )}
                    </div>

                     <div className="modal-footer">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            variant="danger"
                            onClick={onConfirm}
                            loading={loading}
                            disabled={loading}
                        >
                            {confirmText} 
                        </Button>
                    </div>
                </div>
            </div>




        </div>
    );


}


export default DeactivateConfirmationModal;