import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Tag,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  ExternalLink,
  User,
  FileText,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { selectAllDeals } from "../../store/slices/dealsSlice";
import { selectAllTasks } from "../../store/slices/tasksSlice";
import { selectedAllClients } from "../../store/slices/clientsSlice";
import { deleteCompany } from "../../store/slices/companiesSlice";

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, companyName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FEFDFC] flex items-center justify-center">
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
            All associated data including contacts, deals, and tasks will remain
            but will no longer be linked to this company.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-red-50 px-6 py-4 flex gap-3 justify-end border-t border-red-100">
          <button
            onClick={onClose}
            className="px-2.5 py-2 border-2 border-[#BCC8BC] text-[#2f362f] rounded-lg font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-2.5 py-2 bg-red-600 text-white/90 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Company
          </button>
        </div>
      </div>
    </div>
  );
};

const CompanyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const companies = useSelector((state) => state.companies.companies);
  const allDeals = useSelector(selectAllDeals);
  const allTasks = useSelector(selectAllTasks);
  const allClients = useSelector(selectedAllClients);

  const company = companies.find((c) => c.id === parseInt(id));

  const metrics = useMemo(() => {
    if (!company) return null;

    const companyDeals = allDeals.filter(
      (deal) => deal.company === company.name
    );
    const companyTasks = allTasks.filter(
      (task) =>
        task.relatedTo === "Company" &&
        task.relatedName === company.name &&
        task.status !== "Completed"
    );
    const companyContacts = allClients.filter(
      (client) => client.company === company.name
    );

    const pipelineValue = companyDeals
      .filter((d) => d.status === "Active")
      .reduce((sum, deal) => {
        const value = parseInt(deal.value?.replace(/[^0-9]/g, "") || "0");
        return sum + value;
      }, 0);

    const completedTasks = allTasks.filter(
      (task) =>
        task.relatedTo === "Company" &&
        task.relatedName === company.name &&
        task.status === "Completed"
    ).length;

    return {
      totalDeals: companyDeals.length,
      activeDeals: companyDeals.filter((d) => d.status === "Active").length,
      wonDeals: companyDeals.filter((d) => d.status === "Won").length,
      pipelineValue: `$${(pipelineValue / 1000).toFixed(0)}K`,
      contacts: companyContacts.length,
      openTasks: companyTasks.length,
      completedTasks,
      relatedContacts: companyContacts,
      recentDeals: companyDeals,
    };
  }, [company, allDeals, allTasks, allClients]);

  const handleDelete = () => {
    dispatch(deleteCompany(company.id));
    setShowDeleteDialog(false);
    navigate("/companies");
  };

  if (!company || !metrics) {
    return (
      <div className="min-h-screen bg-[#FEFDFC] flex items-center justify-center p-4">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-[#2f362f] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2f362f] mb-2">
            Company Not Found
          </h2>
          <p className="text-[#2f362f] mb-6">
            The company you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/companies")}
            className="px-6 py-3 bg-blue-600 text-[#2f362f] rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#FEFDFC]">
        {/* Sticky Header */}
        <div className="bg-white border-b border-[#BCC8BC] sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/companies")}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Back to Companies"
                >
                  <ArrowLeft className="w-5 h-5 text-[#2f362f]" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-[#2f362f] font-bold text-lg shadow-lg">
                    {company.logo || <Building2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#2f362f]">
                      {company.name}
                    </h1>
                    <p className="text-sm text-[#2f362f]">{company.industry}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/companies`)}
                  className="px-2.5 py-2 bg-slate-900 text-white rounded-md font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-2.5 py-2 border-2 border-red-300 text-red-600 rounded-md font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                company.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : company.status === "Inactive"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  company.status === "Active"
                    ? "bg-green-500"
                    : company.status === "Inactive"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              />
              {company.status}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEFDFC] flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-[#FEFDFC] px-2 py-1 rounded-full">
                  +{metrics.activeDeals} Active
                </span>
              </div>
              <p className="text-3xl font-bold text-[#2f362f] mb-1">
                {metrics.totalDeals}
              </p>
              <p className="text-sm text-[#2f362f]">Total Deals</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEFDFC] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-[#FEFDFC] px-2 py-1 rounded-full">
                  Pipeline
                </span>
              </div>
              <p className="text-3xl font-bold text-[#2f362f] mb-1">
                {metrics.pipelineValue}
              </p>
              <p className="text-sm text-[#2f362f]">Value</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEFDFC] flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-[#FEFDFC] px-2 py-1 rounded-full">
                  Contacts
                </span>
              </div>
              <p className="text-3xl font-bold text-[#2f362f] mb-1">
                {metrics.contacts}
              </p>
              <p className="text-sm text-[#2f362f]">Total Contacts</p>
            </div>

            <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEFDFC] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-[#FEFDFC] px-2 py-1 rounded-full">
                  {metrics.completedTasks} Done
                </span>
              </div>
              <p className="text-3xl font-bold text-[#2f362f] mb-1">
                {metrics.openTasks}
              </p>
              <p className="text-sm text-[#2f362f]">Open Tasks</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Company Overview Card */}
              <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm">
                <h2 className="text-xl font-bold text-[#2f362f] mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#2f362f]" />
                  Company Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#2f362f] uppercase tracking-wide mb-3">
                      Contact Information
                    </h3>
                    {company.email && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Email
                          </p>
                          <p className="text-sm font-medium text-[#2f362f] break-all">
                            {company.email}
                          </p>
                        </div>
                      </div>
                    )}
                    {company.phone1 && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Phone 1
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {company.phone1}
                          </p>
                        </div>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Globe className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Website
                          </p>
                          <a
                            href={`https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 break-all"
                          >
                            {company.website}
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}
                    {company.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Address
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {company.address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#2f362f] uppercase tracking-wide mb-3">
                      Business Details
                    </h3>
                    {company.companySize && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Company Size
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {company.companySize} employees
                          </p>
                        </div>
                      </div>
                    )}
                    {company.annualRevenue && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Annual Revenue
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {company.annualRevenue}
                          </p>
                        </div>
                      </div>
                    )}
                    {company.founded && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Founded
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {company.founded}
                          </p>
                        </div>
                      </div>
                    )}
                    {company.owner && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Owner
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {company.owner}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {company.description && (
                <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm">
                  <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#2f362f]" />
                    Description
                  </h2>
                  <p className="text-[#2f362f] leading-relaxed">
                    {company.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {company.tags && company.tags.length > 0 && (
                <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm">
                  <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#2f362f]" />
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {company.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#FEFDFC] text-blue-700 rounded-lg text-sm font-medium border border-blue-200 hover:bg-[#FEFDFC] transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Activity Summary */}
              <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm">
                <h2 className="text-xl font-bold text-[#2f362f] mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#2f362f]" />
                  Activity
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#FEFDFC] rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-[#2f362f]">
                        Won Deals
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#2f362f]">
                      {metrics.wonDeals}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#FEFDFC] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-[#2f362f]">
                        Active Deals
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#2f362f]">
                      {metrics.activeDeals}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#FEFDFC] rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-[#2f362f]">
                        Tasks Done
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#2f362f]">
                      {metrics.completedTasks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contacts Preview */}
              <div className="bg-white rounded-lg p-6 border border-[#BCC8BC] shadow-sm">
                <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#2f362f]" />
                  Contacts ({metrics.contacts})
                </h2>
                {metrics.relatedContacts.length > 0 ? (
                  <div className="space-y-2">
                    {metrics.relatedContacts.slice(0, 3).map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-[#2f362f] flex items-center justify-center font-semibold text-xs">
                          {contact.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#2f362f] truncate">
                            {contact.name}
                          </p>
                          <p className="text-xs text-[#2f362f]/60 truncate">
                            {contact.position || "Contact"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#2f362f] text-center py-4">
                    No contacts yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        companyName={company.name}
      />
    </>
  );
};

export default CompanyDetailPage;
