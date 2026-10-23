import {  createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import './App.css'
import RootLayout from './routes/RootLayout'
import LoginPage from './pages/auth/LoginPage'
import { loginAction, registerAction } from "./util/AuthActions"
import RegisterPage from './pages/auth/RegisterPage'
import DashboardLayout from './routes/DashboardLayout'
import { rootLoader } from './util/rootLoader'
import CustomerDashboard from './pages/user/CustomerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import FindParking from './components/user/FindParking'
import { locationLoader, locationDetailsLoader } from './util/locationLoader'
import MyReservations from './pages/user/ReservationPage'
import LocationDetailsPage from './components/user/LocationDetails'
import FloorsSlotsPage  from "./components/user/FloorsSlotsPage"
import LocationManagement from "./pages/admin/location/LocationManagement"
import AddLocationWizard from "./pages/admin/AddLocationWizard"

import FloorManagement from "./pages/AdminPages/FloorManagement";
import VehicleManagement from './pages/user/VehiclePage'



import { adminReservationLoader } from './util/admin/ReservationLoader'
import ReservationPage from './pages/admin/ReservationPage'
import ReservationDetails from './pages/admin/ReservationDetailsPage';
import { vehicleEntryAction, reservationDetailsLoader } from './util/admin/ReservationDeatilsLoader'
import SessionPage from './pages/admin/SessionPage';
import { activeSessionsAction, activeSessionsLoader }  from "./util/admin/SessionLoader"
import HistoryPage from './pages/admin/HistoryPage'
import { historyLoader } from './util/admin/historyLoader'
import AdminLocationDetailsPage from './pages/AdminPages/LocationDetailsPage'
import {adminLocationDetailsLoader} from "./util/admin/LocationDetailsLoader"
import { FloorsLoader } from './util/AdminFloorLoader'
import { SlotsLoader } from './util/SlotsLoader'

import SlotsPage from './pages/AdminPages/SlotsPage'
import ReservationConfirmationPage from "./pages/user/ReservationConfirmationPage"
import MySessions from './pages/user/MySessions'
import MyParkingHistory from './pages/user/MyHistoryPage'
import {parkingHistoryDetailsLoader} from "./util/parkingHistoryDetailsLoader";
import ParkingHistoryDetails from './pages/user/ParkingHistoryDetails'
import {adminDashboardLoader} from "./util/AdminDashoardLoader"


MyParkingHistory
const router = createBrowserRouter([
  {
    id: "root",
    path: '/',
    element: <RootLayout />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: 'register',
        element: <RegisterPage />,
        action: registerAction,
      },
      {
        path: "admin",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
            loader: adminDashboardLoader,
          },
          {
            path: "locations",
            element: <LocationManagement />
          },
          {
            path: "locations/new",
            element: <AddLocationWizard />
          },
          {
            path: "locations/:locationId",
            element: <AdminLocationDetailsPage />,
            loader: adminLocationDetailsLoader,
          },
          {
            path: "locations/:locationId/floors",
            element: <FloorManagement />,
            loader: FloorsLoader,
            
          },
          {
            path: "locations/:locationId/floors/:floorId/slots",
            element: <SlotsPage />,
            loader: SlotsLoader,
            // action: adminSlotAction,
          },
          // {
          //   path: "pricing",
          //   element: <PricingManagement />,
          //   loader: adminPricingLoader,
          //   action: adminPricingAction,
          // },
          {
            path: "reservations",
            loader: adminReservationLoader,
            element: <ReservationPage />,

          },
          {
            path: "reservations/:reservationId",
            element: <ReservationDetails />,
            loader: reservationDetailsLoader,
            action: vehicleEntryAction,
          },
          {
            path: "sessions",
            element: <SessionPage />,
            loader: activeSessionsLoader,
            action: activeSessionsAction,
          },
          {
            path: "history",
            element: <HistoryPage />,
            loader: historyLoader,
          }
        ],
      },
      {
        path: "customer",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <CustomerDashboard />,
          },
          {
            path: "find-parking",
            element: <FindParking />,
            loader: locationLoader,
          },
          {
            path: "locations/:locationId",
            element: <LocationDetailsPage />,
            loader:locationDetailsLoader,

          },
          {
            path:"locations/:locationId/floors",
            element:<FloorsSlotsPage />,
            
          },
          {
            path: "reservations/confirm",
            element: <ReservationConfirmationPage />,
          },
          {
            path: "reservations",
            element: <MyReservations />
          },
          {
            path: "sessions",
            element: <MySessions />

          },
          {
            path: "vehicles",
            element: <VehicleManagement />
          },
          {
            path: "history",
            element: <MyParkingHistory />
          },
          {
            path: "history/:sessionId",
            element: <ParkingHistoryDetails />,
            loader: parkingHistoryDetailsLoader
          }
        ]
      }
    ],
  },
]);



function App() {
 

  return <RouterProvider router={router} />;
}

export default App;
