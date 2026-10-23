
export function formatDateTime(value)
{
    if(!value)
    {
        return "-";
    }
    return new Date(value).toLocaleString("en-In", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


