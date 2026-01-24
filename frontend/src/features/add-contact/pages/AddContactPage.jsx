import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import contactService from "../services/contactService";
import { toast } from "sonner";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";

export default function AddContactPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      toast.error("Please provide at least an email or phone number");
      return;
    }

    setLoading(true);
    try {
      await contactService.addContact(formData);
      toast.success("Contact added successfully!");
      navigate("/contacts");
    } catch (error) {
      console.error("Failed to add contact:", error);
      toast.error(error.response?.data?.message || "Failed to add contact");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-3">
            <button
              onClick={() => navigate("/contacts")}
              className="text-gray-600 hover:text-gray-900 text-lg font-semibold"
            >
              ← Back
            </button>
          </div>
          <div className="flex items-center justify-start">
            <img
              src={PesocardLogo}
              alt="PESOCARD Logo"
              className="h-6 sm:h-8 md:h-10 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-auto pb-20">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Contact Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Professional Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Senior Developer"
                />
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes..."
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/contacts")}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Adding..." : "Add Contact"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
