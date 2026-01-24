import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd,
  MdQrCodeScanner,
  MdSearch,
  MdClose,
  MdPeople,
} from "react-icons/md";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PageFooter from "@/components/PageFooter";
import contactService from "../services/contactService";
import PesocardLogo from "@/assets/images/pesocard-logo.svg";

const ContactsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch contacts on mount
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        const response = await contactService.getContacts();
        setContacts(response.data || []);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        // Silently fail - empty state will show
        setContacts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = () => {
    navigate("/add-contact");
  };

  const handleScanCard = () => {
    toast.info("QR Scanner feature coming soon!");
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await contactService.deleteContact(contactId);
      setContacts(contacts.filter((c) => c.id !== contactId));
      toast.success("Contact deleted");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const email = (contact.email || "").toLowerCase();
    const phone = (contact.phone || "").toLowerCase();
    const company = (contact.company || "").toLowerCase();

    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      email.includes(query) ||
      phone.includes(query) ||
      company.includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex justify-center w-full">
      <div className="flex flex-col w-full md:max-w-[430px]">
      <PageHeader
        logo={PesocardLogo}
        badgeCount={filteredContacts.length}
        showBackButton={false}
        showSettings={true}
      />

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <MdSearch className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <MdClose className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {filteredContacts.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            {searchQuery ? (
              <>
                <MdSearch className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  No Results Found
                </h2>
                <p className="text-gray-600 text-sm mb-6 max-w-xs">
                  Try adjusting your search terms or add a new contact
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                {/* Illustration */}
                <div className="relative w-32 h-32 mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></div>
                  <div className="absolute inset-4 bg-blue-50 rounded-full flex items-center justify-center">
                    <MdPeople className="w-16 h-16 text-blue-400" />
                  </div>
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  No Contacts Yet
                </h2>
                <p className="text-gray-600 text-sm mb-8 max-w-xs">
                  Start building your network by adding your first contact or
                  scanning a card
                </p>

                {/* Buttons */}
                <div className="flex justify-center w-full px-4">
                  <div className="max-w-xs w-full space-y-3">
                    <button
                      onClick={handleAddContact}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow-md"
                    >
                      <MdAdd className="w-5 h-5" />
                      Add Your First Contact
                    </button>

                    <button
                      onClick={handleScanCard}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-full transition-colors"
                    >
                      <MdQrCodeScanner className="w-5 h-5" />
                      Scan Card
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          // Contacts List
          <div className="px-4 py-6 space-y-3">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.email && (
                    <p className="text-sm text-gray-600">{contact.email}</p>
                  )}
                  {contact.phone && (
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  )}
                  {contact.company && (
                    <p className="text-xs text-gray-500 mt-1">
                      {contact.company}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <MdClose className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <PageFooter />
      </div>
    </div>
  );
};

export default ContactsPage;

