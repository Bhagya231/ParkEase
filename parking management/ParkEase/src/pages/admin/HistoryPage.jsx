import { useLoaderData } from "react-router-dom";

import HistoryTable from "../../components/admin/HistoryTable";

function HistoryPage()
{
    const {sessions, page, totalPages,totalElements,size } = useLoaderData();


    return (
         <div className="container-fluid py-3">
            <div className="mb-4">
                <h2 className="mb-1">Parking History</h2>
                <p className="text-muted mb-0">
                    View all completed parking sessions and their payment details.
                </p>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">

                     {sessions.length === 0 ? (
                        <div className="text-center py-4">
                            <img
                                src="/no-parking-history.png"
                                alt="No parking history available"
                                className="img-fluid mb-3"
                                style={{ maxWidth: "420px" }}
                            />

                            {/* <h5 className="text-dark">
                                No Parking History Found
                            </h5>

                            <p className="text-muted mb-0">
                                There are no completed parking sessions to display
                                at the moment.
                            </p> */}
                        </div>
                        ) : (
                            <HistoryTable
                                sessions={sessions}
                                page={page}
                                totalPages={totalPages}
                                totalElements={totalElements}
                                size={size}
                            />
                        )}

                </div>
            </div>
        </div>

    );
}

export default HistoryPage;