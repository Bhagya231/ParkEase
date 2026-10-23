

import { useLoaderData, useActionData, useNavigation, useSearchParams } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import ActiveSessionsTable from "../../components/admin/ActiveSessionsTable";




function SessionPage()
{
    const { sessions=[], totalPages = 0, totalElements =0 ,currentPage = 0, pageSize = 10} = useLoaderData();


    const actionData = useActionData();
    const navigation = useNavigation();
    const [searchParams, setSearchParams] = useSearchParams();


     const isSubmitting = navigation.state === "submitting";
    const isLoading = navigation.state === "loading";

    function changePage(page) 
    {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set("page", page);
        nextParams.set("size", pageSize);
        setSearchParams(nextParams);
    }


    return (
       
        <div className="container-fluid py-3">
            <PageHeader
                title="Active Sessions"
                description="Monitor currently parked vehicles and record vehicle exits."
            />

            {actionData?.success === false && (
                <div className="alert alert-danger py-2 mb-3">
                    {actionData.message}
                </div>
            )}


             <Card title={`Active Sessions (${totalElements})`}>
                <ActiveSessionsTable
                    sessions={sessions}
                    isSubmitting={isSubmitting}
                />

                {totalPages > 0 && (
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
                        <span className="text-muted small">
                            Page {currentPage + 1} of {totalPages}
                            {" · "}
                            {totalElements} sessions
                        </span>

                        <div className="d-flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={currentPage === 0 || isLoading}
                                onClick={() => changePage(currentPage - 1)}
                            >
                                Previous
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={currentPage >= totalPages - 1 || isLoading}
                                onClick={() => changePage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>


    );
}



export default SessionPage;



