import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Handshake,
  Calendar,
  User,
  Edit2,
  Trash2,
  Search,
  Plus,
  Clock,
  Briefcase,
  Flag,
  AlertTriangle,
} from "lucide-react";
import {
  selectAllDeals,
  selectSearchTerm,
  selectFilterStage,
  setSearchTerm,
  setFilterStage,
  deleteDeal,
} from "../store/slices/dealsSlice";
import { dealStages } from "../data/dealsData";
import AddDealModal from "../components/modals/AddDealModal";
import { Navigate, useNavigate } from "react-router-dom";

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, dealName }) => {
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
              <h3 className="text-xl font-bold text-[#2f362f]">Delete Deal</h3>
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
            <span className="font-bold text-[#2f362f]">"{dealName}"</span>?
          </p>
          <p className="text-sm text-[#2f362f] mt-3 bg-[#FEFDFC] p-3 rounded-lg border border-[#BCC8BC]">
            ⚠️ This will permanently remove the deal from your pipeline.
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
            Delete Deal
          </button>
        </div>
      </div>
    </div>
  );
};

const DealsPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const deals = useSelector(selectAllDeals);
  const searchTerm = useSelector(selectSearchTerm);
  const filterStage = useSelector(selectFilterStage);

  const [dealEditModal, setDealEditModal] = useState({
    open: false,
    data: null,
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    dealId: null,
    dealName: "",
  });

  const handleDeleteClick = (deal, event) => {
    event.stopPropagation();
    setDeleteDialog({
      open: true,
      dealId: deal.id,
      dealName: deal.dealName,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.dealId != null) {
      dispatch(deleteDeal(deleteDialog.dealId));
    }
    setDeleteDialog({ open: false, dealId: null, dealName: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, dealId: null, dealName: "" });
  };

  const openDealEdit = (data = null, event = null) => {
    if (event) event.stopPropagation();
    setDealEditModal({ open: true, data });
  };

  const closeDealEdit = () => {
    setDealEditModal({ open: false, data: null });
  };

  // Format currency
  const formatCurrency = (value, currency) => {
    if (!value) return "N/A";
    const numValue = parseInt(value);
    if (numValue >= 1000000) {
      return `${currency} ${(numValue / 1000000).toFixed(1)}M`;
    } else if (numValue >= 1000) {
      return `${currency} ${(numValue / 1000).toFixed(0)}K`;
    }
    return `${currency} ${numValue.toLocaleString()}`;
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2f362f] mb-2 sm:mb-3">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-[#2f362f]/60 transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Deals</span>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2f362f] mb-1 sm:mb-2 tracking-tight">
              All Deals
            </h1>
            <p className="text-[#2f362f] text-sm sm:text-base lg:text-lg">
              {deals.length} deals in pipeline
            </p>
          </div>

          {/* Search and Filter - Stack on mobile, row with justify-between on tablet+ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#2f362f] cursor-pointer" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-9 sm:pl-10 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-48 lg:w-64 text-sm"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                value={filterStage}
                onChange={(e) => dispatch(setFilterStage(e.target.value))}
                className="px-2 sm:px-2.5 py-2 border border-[#BCC8BC] rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm flex-1 sm:flex-none"
              >
                <option value="All">All Stages</option>
                {dealStages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
              <button
                onClick={() => openDealEdit()}
                className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold cursor-pointer flex items-center gap-1 sm:gap-2 transition-all text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Deal</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid - Responsive 1 to 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {deals.map((deal) => {
          return (
            <div
              key={deal.id}
              className="bg-[#FEFDFC] rounded-xl p-4 sm:p-5 lg:p-6 shadow-sm border border-[#BCC8BC] hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={(e) => openDealEdit(deal, e)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-[#BCC8BC] flex items-center justify-center text-[#2f362f] shadow-md shrink-0">
                    <Handshake className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#2f362f] truncate">
                      {deal.dealName}
                    </h3>
                    <p className="text-xs text-[#2f362f] flex items-center gap-1 mt-1">
                      <Briefcase className="w-3 h-3" />
                      {deal.pipeline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Deal Value & Status */}
              <div className="mb-4 pb-4 border-b border-[#BCC8BC]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs text-[#2f362f] mb-1">Deal Value</p>
                    <p className="text-2xl font-bold text-[#2f362f]">
                      {formatCurrency(deal.dealValue, deal.currency)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      deal.status === "Closed Won"
                        ? "bg-green-100 text-green-700"
                        : deal.status === "Closed Lost"
                        ? "bg-red-100 text-red-700"
                        : deal.status === "Negotiation"
                        ? "bg-blue-100 text-blue-700"
                        : deal.status === "Proposal"
                        ? "bg-purple-100 text-purple-700"
                        : deal.status === "New"
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {deal.status}
                  </span>
                </div>
                <p className="text-xs text-[#2f362f]">
                  {deal.period} • {deal.currency}
                  {deal.periodValue && ` • ${deal.periodValue} period(s)`}
                </p>
              </div>

              {/* Contact & Assignee */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-[#2f362f]">Contact:</span>
                    <span className="ml-1 font-medium truncate">
                      {deal.contact}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs text-[#2f362f]">Assignee:</span>
                    <span className="ml-1 font-medium truncate">
                      {deal.assignee}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2 mb-4 pb-4 border-b border-[#BCC8BC]">
                {deal.dueDate && (
                  <div className="flex items-center gap-2 text-xs text-[#2f362f]">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Due: {deal.dueDate}</span>
                  </div>
                )}
                {deal.expectedClosingDate && (
                  <div className="flex items-center gap-2 text-xs text-[#2f362f]">
                    <Calendar className="w-3.5 h-3.5 text-green-500" />
                    <span>Closing: {deal.expectedClosingDate}</span>
                  </div>
                )}
                {deal.followUpDate && (
                  <div className="flex items-center gap-2 text-xs text-[#2f362f]">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" />
                    <span>Follow-up: {deal.followUpDate}</span>
                  </div>
                )}
              </div>

              {/* Priority & Source */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flag
                    className={`w-4 h-4 ${
                      deal.priority === "High" || deal.priority === "Urgent"
                        ? "text-red-500"
                        : deal.priority === "Medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      deal.priority === "High" || deal.priority === "Urgent"
                        ? "text-red-700"
                        : deal.priority === "Medium"
                        ? "text-yellow-700"
                        : "text-green-700"
                    }`}
                  >
                    {deal.priority}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#2f362f]">
                  <span>Source:</span>
                  <span className="font-medium text-[#2f362f]">
                    {deal.source}
                  </span>
                </div>
              </div>

              {/* Projects */}
              {deal.project && deal.project.length > 0 && (
                <div className="mb-4 pb-4 border-b border-[#BCC8BC]">
                  <p className="text-xs text-[#2f362f] mb-2 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    Projects:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {deal.project.slice(0, 2).map((proj, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                      >
                        {proj}
                      </span>
                    ))}
                    {deal.project.length > 2 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-[#2f362f] rounded text-xs">
                        +{deal.project.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {deal.tags && deal.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {deal.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {deal.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-slate-100 text-[#2f362f] rounded-full text-xs">
                        +{deal.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-2 bg-slate-100 text-[#2f362f] rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm flex items-center justify-center gap-1.5"
                  onClick={(e) => openDealEdit(deal, e)}
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={(e) => handleDeleteClick(deal, e)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Deal Modal */}
      <AddDealModal
        open={dealEditModal.open}
        onClose={closeDealEdit}
        mode={dealEditModal.data ? "edit" : "add"}
        initialData={dealEditModal.data}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        dealName={deleteDialog.dealName}
      />
    </div>
  );
};

export default DealsPage;
