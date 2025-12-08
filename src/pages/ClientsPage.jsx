import React, { useState } from "react";
import {
  Mail,
  Phone,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Search,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedFilterStatus,
  selectedSearchTerm,
  deleteClient,
  setFilterStatus,
  setSearchTerm,
  selectedAllClients,
} from "../store/slices/clientsSlice";
import AddUserModal from "../components/modals/AddUserModal";
import { useNavigate } from "react-router-dom";

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, clientName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#f8faf9] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#2f362f]">
                Delete Client
              </h3>
              <p className="text-sm text-[#2f362f] mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#2f362f] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900">"{clientName}"</span>?
          </p>
          <p className="text-sm text-[#2f362f] mt-3 bg-[#FEFDFC] p-3 rounded-lg border border-[#BCC8BC]">
            ⚠️ All associated data including deals and tasks will remain but
            will no longer be linked to this client.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#FEFDFC] px-6 py-4 flex gap-3 justify-end border-t border-[#BCC8BC]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-[#BCC8BC] text-[#2f362f] rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-[#2f362f] rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Client
          </button>
        </div>
      </div>
    </div>
  );
};
const ClientsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clients = useSelector(selectedAllClients);
  const searchTerm = useSelector(selectedSearchTerm);
  const filterStatus = useSelector(selectedFilterStatus);

  const [clientEditModal, setClientEditModal] = useState({
    open: false,
    data: null,
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    clientId: null,
    clientName: "",
  });

  const handleDeleteClick = (client, event) => {
    event.stopPropagation();
    const displayName =
      client?.name ||
      [client?.firstName, client?.lastName].filter(Boolean).join(" ") ||
      "this client";

    setDeleteDialog({
      open: true,
      clientId: client.id,
      clientName: displayName,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.clientId != null) {
      dispatch(deleteClient(deleteDialog.clientId));
    }
    setDeleteDialog({ open: false, clientId: null, clientName: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, clientId: null, clientName: "" });
  };

  const openClientDetail = (data) => {
    navigate(`/clients/${data.id}`);
  };

  const openClientEdit = (data = null) => {
    setClientEditModal({ open: true, data });
  };

  const closeClientEdit = () => {
    setClientEditModal({ open: false, data: null });
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2f362f] mb-2 sm:mb-3">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-[#2f362f]/60 transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Clients</span>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 sm:mb-2 tracking-tight">
              All Clients
            </h1>
            <p className="text-[#2f362f] text-sm sm:text-base lg:text-lg">
              {clients.length} clients found
            </p>
          </div>

          {/* Search and Filter - Stack on mobile, row with justify-between on tablet+ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#2f362f] cursor-pointer" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-9 sm:pl-10 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-48 lg:w-64 text-sm"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                value={filterStatus}
                onChange={(e) => dispatch(setFilterStatus(e.target.value))}
                className="px-2 sm:px-2.5 py-2 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-sm flex-1 sm:flex-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button
                onClick={() => openClientEdit()}
                className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold flex items-center gap-1 sm:gap-2 transition-all text-sm cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Client</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Client Cards Grid - Responsive 1 to 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-[#FEFDFC] rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border border-[#BCC8BC] transition-all duration-300 group cursor-pointer"
            onClick={() => openClientDetail(client)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-full bg-[#BCC8BC] flex items-center justify-center text-[#2f362f] font-bold text-2xl shadow-md">
                {client.name.charAt(0)}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  client.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {client.status}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-[#2f362f] mb-1">
                {client.name}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Joined {client.joinDate}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b border-[#BCC8BC]">
              <p className="text-xs text-slate-500">
                Last active: {client.lastActive}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                className="flex-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  openClientDetail(client);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                View
              </button>
              <button
                className="px-2.5 py-1.5 bg-slate-100 text-[#2f362f] rounded-md hover:bg-slate-200 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  openClientEdit(client);
                }}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => handleDeleteClick(client, e)}
                className="px-2.5 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddUserModal
        open={clientEditModal.open}
        onClose={closeClientEdit}
        mode={clientEditModal.data ? "edit" : "add"}
        initialData={clientEditModal.data}
      />
      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        clientName={deleteDialog.clientName}
      />
    </div>
  );
};

export default ClientsPage;
