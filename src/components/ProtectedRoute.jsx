import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthContext(); // Get the current user from the context

  if (!user) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/signIn" />;
  }

  // If the user is authenticated, render the requested page
  return children;
};

export default ProtectedRoute;
