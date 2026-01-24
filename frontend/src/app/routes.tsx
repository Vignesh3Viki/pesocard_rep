import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LandingPage } from "../features/landing";
import { AboutPage } from "../features/about";
import { SignupPage } from "../features/signup";
import { LoginPage } from "../features/login";
import { EditProfilePage } from "../features/edit-profile";
import { MyCardPage } from "../features/my-card";
import PublicCardView from "../features/my-card/pages/PublicCardView";
import { AnalyticsPage } from "../features/analytics";
import { AddContactPage, ContactsPage } from "../features/add-contact";
import SettingsPage from "../components/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Root route - Login page (public) */}
      <Route path="/" element={<LoginPage />} />

      {/* Landing page (public) */}
      <Route path="/landing" element={<LandingPage />} />

      {/* About page (public) */}
      <Route path="/about" element={<AboutPage />} />

      {/* Signup page (public) */}
      <Route path="/signup" element={<SignupPage />} />

      {/* Login page (public) */}
      <Route path="/login" element={<LoginPage />} />

      {/* My Card with ID (for sharing) - No authentication required - MUST come before /my-card */}
      <Route path="/my-card/:id" element={<PublicCardView />} />

      {/* My Card page - Only requires authentication */}
      <Route
        path="/my-card"
        element={
          <ProtectedRoute element={<MyCardPage />} requiredAuth={false} />
        }
      />

      {/* Edit Profile page */}
      <Route
        path="/edit"
        element={
          <ProtectedRoute element={<EditProfilePage />} requiredAuth={true} />
        }
      />
      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute element={<EditProfilePage />} requiredAuth={true} />
        }
      />

      {/* Contacts pages - Require authentication */}
      <Route
        path="/contacts"
        element={
          <ProtectedRoute element={<ContactsPage />} requiredAuth={true} />
        }
      />
      <Route
        path="/add-contact"
        element={
          <ProtectedRoute element={<AddContactPage />} requiredAuth={true} />
        }
      />

      {/* Analytics page - Require authentication */}
      <Route
        path="/analytics"
        element={
          <ProtectedRoute element={<AnalyticsPage />} requiredAuth={true} />
        }
      />

      {/* Settings page - Require authentication */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute element={<SettingsPage />} requiredAuth={true} />
        }
      />

      {/* Redirect all unknown routes to my-card (with protection) */}
      <Route path="*" element={<Navigate to="/my-card" />} />
    </Routes>
  );
}
