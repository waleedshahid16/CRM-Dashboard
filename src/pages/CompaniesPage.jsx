import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Users,
  DollarSign,
  Globe,
  Calendar,
  Eye,
  Edit2,
  Trash2,
  Search,
  Plus,
  Building2,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAllCompanies,
  selectSearchTerm,
  selectFilterIndustry,
  deleteCompany,
  setSearchTerm,
  setFilterIndustry,
  selectIndustries,
} from "../store/slices/companiesSlice";
import { industryColors } from "../constants/colorClasses";
import AddCompanyModal from "../components/modals/AddCompanyModal";

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, companyName }) => {
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
                Delete Company
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
            <span className="font-bold text-[#2f362f]">"{companyName}"</span>?
          </p>
          <p className="text-sm text-[#2f362f] mt-3 bg-[#FEFDFC] p-3 rounded-lg border border-[#BCC8BC]">
            âš ï¸ All associated data including contacts, deals, and tasks will
            remain but will no longer be linked to this company.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#FEFDFC] px-6 py-4 flex gap-3 justify-end border-t border-[#BCC8BC]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-[#BCC8BC] text-[#2f362f] rounded-lg font-semibold  transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-[#2f362f] rounded-lg font-semibold  transition-colors flex items-center gap-2 shadow-lg shadow-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );
};

const CompaniesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const companies = useSelector(selectAllCompanies);
  const industries = useSelector(selectIndustries);
  const searchTerm = useSelector(selectSearchTerm);
  const filterIndustry = useSelector(selectFilterIndustry);

  const [companyEditModal, setCompanyEditModal] = useState({
    open: false,
    data: null,
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    companyId: null,
    companyName: "",
  });

  const handleDeleteClick = (id, companyName, e) => {
    e.stopPropagation();
    setDeleteDialog({
      open: true,
      companyId: id,
      companyName: companyName,
    });
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteCompany(deleteDialog.companyId));
    setDeleteDialog({ open: false, companyId: null, companyName: "" });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, companyId: null, companyName: "" });
  };

  const openCompanyDetail = (data) => {
    navigate(`/companies/${data.id}`);
  };

  const openCompanyEdit = (data = null) => {
    setCompanyEditModal({ open: true, data });
  };

  const closeCompanyEdit = () => {
    setCompanyEditModal({ open: false, data: null });
  };

  return (
    <>
      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-[#2f362f] mb-3">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-[#2f362f] font-medium">Companies</span>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#2f362f] mb-2 tracking-tight">
                All Companies
              </h1>
              <p className="text-[#2f362f] text-lg">
                {companies.length} companies across {industries.length - 1}{" "}
                industries
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2f362f]" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="pl-10 pr-4 py-2 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <select
                value={filterIndustry}
                onChange={(e) => dispatch(setFilterIndustry(e.target.value))}
                className="px-2.5 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              <button
                onClick={() => openCompanyEdit()}
                className="px-2.5 py-2 bg-blue-200 text-[#2f362f] rounded-md font-semibold flex items-center gap-2 transition-all  text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {companies.map((company) => {
            const colors =
              industryColors[company.industry] || industryColors.Technology;
            return (
              <div
                key={company.id}
                className="bg-[#f8faf9] rounded-lg p-6 shadow-sm border border-[#BCC8BC] hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => openCompanyDetail(company)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-[#BCC8BC] flex items-center justify-center text-[#2f362f] font-bold text-xl shadow-md`}
                  >
                    {company.logo || <Building2 className="w-8 h-8" />}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${colors.light} ${colors.text}`}
                  >
                    {company.industry}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#2f362f] mb-1">
                    {company.name}
                  </h3>
                  <div className="space-y-2 mt-3">
                    {company.email && (
                      <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{company.email}</span>
                      </div>
                    )}
                    {company.phone1 && (
                      <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{company.phone1}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2 text-sm text-[#2f362f]">
                        <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{company.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-[#BCC8BC]">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#2f362f] mb-1">
                      <Users className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-bold text-[#2f362f]">
                      {company.companySize || "N/A"}
                    </p>
                    <p className="text-xs text-[#2f362f]">Company Size</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#2f362f] mb-1">
                      <DollarSign className="w-3 h-3" />
                    </div>
                    <p className="text-sm font-bold text-[#2f362f]">
                      {company.annualRevenue || "N/A"}
                    </p>
                    <p className="text-xs text-[#2f362f]">Revenue</p>
                  </div>
                </div>

                {company.tags && company.tags.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-[#BCC8BC]">
                    <div className="flex items-center gap-1 mb-2">
                      <Tag className="w-3 h-3 text-[#2f362f]" />
                      <span className="text-xs text-[#2f362f] font-medium">
                        Tags
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {company.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-slate-100 text-[#2f362f] rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {company.tags.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-[#2f362f] rounded text-xs">
                          +{company.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-semibold ${
                      company.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : company.status === "Inactive"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {company.status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCompanyDetail(company);
                      }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="px-3 py-2 bg-slate-100 text-[#2f362f] rounded-md hover:bg-slate-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCompanyEdit(company);
                      }}
                      title="Edit Company"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) =>
                        handleDeleteClick(company.id, company.name, e)
                      }
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                      title="Delete Company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <AddCompanyModal
          open={companyEditModal.open}
          onClose={closeCompanyEdit}
          mode={companyEditModal.data ? "edit" : "add"}
          initialData={companyEditModal.data}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        companyName={deleteDialog.companyName}
      />
    </>
  );
};

export default CompaniesPage;
