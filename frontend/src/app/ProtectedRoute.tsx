import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredAuth?: boolean;
}

/**
 * ProtectedRoute component to guard routes that require authentication
 * If requiredAuth is true, user must have a valid token to access the route
 * Otherwise, redirect to signup page
 */
export function ProtectedRoute({ element, requiredAuth = true }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  
  if (requiredAuth && !token) {
    // No token found, redirect to signup
    return <Navigate to="/" replace />;
  }
  
  return element;
}
