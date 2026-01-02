import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../Pages/Authenticaion/Login/Login";
import Register from "../Pages/Authenticaion/Login/Register";
import Coverage from "../Pages/Coverage/Coverage";
import SendParcel from "../Pages/SendParcel/SendParcel";
import PrivateRoute from "../Routes/PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout";
import MyParcels from "../Pages/DahsboardPgs/MyParcels/MyParcels";
import Payment from "../Pages/DahsboardPgs/Payment/Payment";
import PaymentHistory from "../Pages/DahsboardPgs/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/DahsboardPgs/TrackParcel/TrackParcel";
import BeARider from "../Pages/DahsboardPgs/BeARider/BeARider";
import PendingRiders from "../Pages/DahsboardPgs/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/DahsboardPgs/ActiveRiders/ActiveRiders";
import RejectedRiders from "../Pages/DahsboardPgs/RejectedRiders/RejectedRiders";
import MakeAdmin from "../Pages/DahsboardPgs/MakeAdmin/MakeAdmin";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminRoute from "../Routes/AdminRoute";
import AssignRider from "../Pages/DahsboardPgs/AssignRider/AssignRider";
import RiderRoute from "../Routes/RiderRoute";
import PendingDeliveries from "../Pages/DahsboardPgs/PendingDeliveries/PendingDeliveries";
import CompletedDelivery from "../Pages/DahsboardPgs/CompletedDelivery/CompletedDelivery";
import MyEarnings from "../Pages/DahsboardPgs/MyEarnings/MyEarnings";
import DashboardHome from "../Pages/DahsboardPgs/DashboardHome/DashboardHome";
import Profile from "../Pages/DahsboardPgs/Profile/Profile";

export const router = createBrowserRouter([
  // -----------------------
  // ROOT LAYOUT
  // -----------------------
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "coverage",
        element: <Coverage />,
        loader: () => fetch("./serviceCanter.json"),
      },
      {
        path: "forbidden",
        element: <Forbidden />,
      },
      {
        path: "beARider",
        element: (
          <PrivateRoute>
            <BeARider />
          </PrivateRoute>
        ),
        loader: () => fetch("./serviceCanter.json"),
      },
      {
        path: "sendParcel",
        element: (
          <PrivateRoute>
            <SendParcel />
          </PrivateRoute>
        ),
        loader: () => fetch("./serviceCanter.json"),
      },
    ],
  },

  // -----------------------
  // AUTH LAYOUT
  // -----------------------
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  // -----------------------
  // DASHBOARD LAYOUT
  // -----------------------
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element:<DashboardHome/>
      },
      {
        path: "myParcels",
        element: <MyParcels />,
      },
      {
        path: "payment/:parcelId",
        element: <Payment />,
      },
      {
        path: "paymentHistory",
        element: <PaymentHistory />,
      },
      {
        path: "track",
        element: <TrackParcel />,
      },
      // rider only routs
      {
        path: "pendingDeliveries",
        element: (
          <RiderRoute>
            <PendingDeliveries />
          </RiderRoute>
        ),
      },
      {
        path: "completedDeliveries",
        element: (
          <RiderRoute>
            <CompletedDelivery />
          </RiderRoute>
        ),
      },
      {
        path: "myEarnings",
        element: (
          <RiderRoute>
            <MyEarnings />
          </RiderRoute>
        ),
      },

      //admin only routers
      {
        path: "assignRider",
        element: (
          <AdminRoute>
            <AssignRider />
          </AdminRoute>
        ),
      },
      {
        path: "activeRiders",
        element: (
          <AdminRoute>
            <ActiveRiders />
          </AdminRoute>
        ),
      },
      {
        path: "pendingRiders",
        element: (
          <AdminRoute>
            <PendingRiders />
          </AdminRoute>
        ),
      },
      {
        path: "rejectedRiders",
        element: (
          <AdminRoute>
            <RejectedRiders />
          </AdminRoute>
        ),
      },
      {
        path: "makeAdmin",
        element: (
          <AdminRoute>
            <MakeAdmin />
          </AdminRoute>
        ),
      },
      {
        path: 'profile',
        element: <Profile/>
      }
    ],
  },
]);
