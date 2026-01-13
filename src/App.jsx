import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./pages/AppLayout";
import { Landing } from "./pages/User/Landing";
import { LoginPage } from "./pages/LoginPage";


function App() {
const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <LoginPage/>,
        },
        {
          path: "/Landing",
          element: <Landing/>,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
