import { Navigate } from "react-router-dom";
import React from "react";

interface ProfileGuardProps {
  element: React.ReactElement;
}

/**
 * ProfileGuard component to check if user profile is completed
 * If profile is not completed, redirect to edit-profile page
 * Otherwise, render the protected element
 */
export function ProfileGuard({ element }: ProfileGuardProps) {
  // Check if user has completed their profile by checking localStorage
  // (profile completion status can be set when user saves profile data)
  const profileCompleted = localStorage.getItem("profileCompleted") === "true";

  if (!profileCompleted) {
    return <Navigate to="/edit-profile" replace />;
  }

  return element;
}
