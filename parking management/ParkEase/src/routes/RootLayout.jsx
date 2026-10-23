import { Outlet } from "react-router-dom";


function RootLayout() {
  return (
    <main className="min-vh-100">
      <Outlet />
    </main>
  );
}

export default RootLayout;