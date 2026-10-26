import { X } from "lucide-react";
import Button from "./Button";

function LogoutModal({ show , onCancel, onConfirm,loading = false})
{
    if(!show)
    {
        return null;
    }

    return (
        <>

        <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true"
                aria-labelledby="logoutModalTitle">
            
            <div  className="modal-dialog modal-dialog-centered">

                <div className="modal-content border-0 shadow">

                    <div className="modal-header">
                        <h5 className="modal-title" id="logoutModalTitle">
                            Confirm Logout
                        </h5>

                        <Button
                                type="button"
                                className="btn-close"
                                onClick={onCancel}
                                disabled={loading}
                                aria-label="Close"
                            > <X size={20} /></Button>


                    </div>

                    <div className="modal-body text-center py-4">
                        <i className="bi bi-box-arrow-right text-danger fs-1" />
                        <p className="mt-3 mb-1 fw-semibold">Are you sure you want to log out?</p>
                        <p className="text-muted small mb-0">You will need to log in again to access your account.</p>
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
                        Logout
                    </Button>
                </div>

                </div>
               





            </div>

        </div>

        <div className="modal-backdrop fade show" />
        </>
    )
}


export default LogoutModal;