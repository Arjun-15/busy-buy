import React, { useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useAuthContext } from "./context/authContext";
import { ProductsContextProvider } from "./context/productContext";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ErrorBoundary from "./pages/Errors/ErrorBoundary";
import Products from "./pages/Products/Products";
import Login from "./pages/Users/Login";
import SignUp from "./pages/Users/SignUp";
import Cart from "./pages/Carts";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { setAuthUser } = useAuthContext(); // Access setAuthUser from context

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user); // Call setAuthUser when user is logged in
      }
    });
  }, []); // Add setAuthUser as a dependency

  const browerRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <header>
            <Navbar />
          </header>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "signIn", element: <Login /> },
        { path: "signup", element: <SignUp /> },
        {
          path: "product",
          element: (
            <ProtectedRoute>
              <Products showForm={true} />{" "}
            </ProtectedRoute>
          ),
        },
        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          ),
        },
        {
          path: "myorders",
          element: (
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <div className="App">
      <ProductsContextProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <RouterProvider router={browerRouter} />

      </ProductsContextProvider>
    </div>
  );
}

export default App;
