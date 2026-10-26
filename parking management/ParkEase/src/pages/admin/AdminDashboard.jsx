import { Link,useLoaderData } from "react-router-dom";


function AdminDashboard() {
  const dashboard = useLoaderData();

  const revenu = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
      }).format(dashboard?.totalRevenue?? 0) ;

  const stats = [
    { title: "Total Locations", value: dashboard?.totalLocations ?? 0, icon: "bi-geo-alt" },
    { title: "Available Slots", value: dashboard?.availableSlots ?? 0, icon: "bi-p-square" },
    { title: "Occupied Slots", value: dashboard?.occupiedSlots ?? 0, icon: "bi-car-front" },
    { title: "Active Sessions", value: dashboard?.activeSessions ?? 0, icon: "bi-clock-history" },
    { title: "Total Revenue", value: revenu, icon: "bi-currency-rupee" }
  ];


  const quickLinks = [
    {
      title: "Locations",
      description: "View and manage parking locations.",
      icon: "bi-geo-alt",
      path: "/admin/locations",
    },
    // {
    //   title: "Users",
    //   description: "View registered users.",
    //   icon: "bi-people",
    //   path: "/admin/users",
    // },
    {
      title: "Parking History",
      description: "Review completed parking sessions.",
      icon: "bi-clock-history",
      path: "/admin/history",
    },
    {
      title: "Active Sessions",
      description: "Monitor ongoing parking sessions.",
      icon: "bi-car-front",
      path: "/admin/sessions",
    },
  ];

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p className="text-secondary mb-1">Workspace / Overview</p>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-secondary mb-0">
             Monitor your ParkEase operations.
          </p>
        </div>

        <Link to="/admin/locations/new" className="btn btn-success">
          <i className="bi bi-plus-lg me-2"></i>
          Add Location 
        </Link>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div className="col-12 col-sm-6 col-xl-3" key={stat.title}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-secondary">{stat.title}</span>
                  <i className={`bi ${stat.icon} fs-4 text-success`}></i>
                </div>

                <h3 className="fw-bold mb-0">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>


       {/* Quick Access */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="mb-4">
            <h5 className="fw-bold mb-1">Quick Access</h5>
            <p className="text-secondary mb-0">
              Navigate directly to your management pages.
            </p>
          </div>
          <div className="row g-3">
            {quickLinks.map((item) => (
              <div className="col-12 col-md-6 col-xl-4" key={item.title}>
                <Link
                  to={item.path}
                  className="card h-100 text-decoration-none border rounded-3 quick-access-card"
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-3 bg-success bg-opacity-10 p-3">
                        <i className={`bi ${item.icon} fs-4 text-success`}></i>
                      </div>
                      <i className="bi bi-arrow-up-right ms-auto text-secondary"></i>
                    </div>

                    <h6 className="fw-bold text-dark mb-2">
                      {item.title}
                    </h6>
                    <p className="text-secondary small mb-0">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          </div>
      </div>



    
    </div>
  );
}

export default AdminDashboard;