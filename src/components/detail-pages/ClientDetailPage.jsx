import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  Building2,
  Tag,
  Star,
  Edit,
  Trash2,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertTriangle,
  Award,
  Target,
  DollarSign,
} from "lucide-react";
import {
  selectedAllClients,
  deleteClient,
} from "../../store/slices/clientsSlice";
import { selectAllDeals } from "../../store/slices/dealsSlice";
import { selectAllTasks } from "../../store/slices/tasksSlice";

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, clientName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#FEFDFC] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
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
              <p className="text-sm text-[#2f362f]/70 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#2f362f] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#2f362f]">"{clientName}"</span>?
          </p>
          <p className="text-sm text-[#2f362f]/70 mt-3 bg-[#f8faf9] p-3 rounded-md border border-[#BCC8BC]">
            ⚠️ All associated data including deals and tasks will remain but
            will no longer be linked to this client.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-red-50 px-6 py-4 flex gap-3 justify-end border-t border-red-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-[#BCC8BC] text-[#2f362f] rounded-md font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg shadow-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Delete Client
          </button>
        </div>
      </div>
    </div>
  );
};

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const clients = useSelector(selectedAllClients);
  const allDeals = useSelector(selectAllDeals);
  const allTasks = useSelector(selectAllTasks);

  const client = clients.find((c) => c.id === parseInt(id));

  const metrics = useMemo(() => {
    if (!client) return null;

    const clientDeals = allDeals.filter((deal) => deal.contact === client.name);
    const clientTasks = allTasks.filter(
      (task) =>
        task.responsiblePersons?.includes(client.name) &&
        task.status !== "Completed"
    );

    const activeDeals = clientDeals.filter((d) => d.status === "Active").length;
    const wonDeals = clientDeals.filter(
      (d) => d.status === "Closed Won"
    ).length;

    const totalDealValue = clientDeals
      .filter((d) => d.status === "Active")
      .reduce((sum, deal) => {
        const value = parseInt(deal.dealValue?.replace(/[^0-9]/g, "") || "0");
        return sum + value;
      }, 0);

    const completedTasks = allTasks.filter(
      (task) =>
        task.responsiblePersons?.includes(client.name) &&
        task.status === "Completed"
    ).length;

    return {
      totalDeals: clientDeals.length,
      activeDeals,
      wonDeals,
      pipelineValue: `$${(totalDealValue / 1000).toFixed(0)}K`,
      openTasks: clientTasks.length,
      completedTasks,
      relatedDeals: clientDeals,
    };
  }, [client, allDeals, allTasks]);

  const handleDelete = () => {
    dispatch(deleteClient(client.id));
    setShowDeleteDialog(false);
    navigate("/clients");
  };

  if (!client || !metrics) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-4">
        <div className="text-center">
          <User className="w-16 h-16 text-[#2f362f] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2f362f] mb-2">
            Client Not Found
          </h2>
          <p className="text-[#2f362f]/70 mb-6">
            The client you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/clients")}
            className="px-6 py-3 bg-[#BCC8BC] text-[#2f362f] rounded-xl font-semibold hover:bg-[#aab5aa] transition-colors"
          >
            Back to Clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#f8faf9]">
        {/* Sticky Header */}
        <div className="bg-[#FEFDFC] border-b border-[#BCC8BC] sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/clients")}
                  className="p-2 hover:bg-[#f8faf9] rounded-md transition-colors"
                  title="Back to Clients"
                >
                  <ArrowLeft className="w-5 h-5 text-[#2f362f]" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#BCC8BC] flex items-center justify-center text-[#2f362f] font-bold text-lg shadow-lg">
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      client.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#2f362f]">
                      {client.name}
                    </h1>
                    <p className="text-sm text-[#2f362f]/70">
                      {client.jobTitle || client.position} at {client.company}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/clients`)}
                  className="px-2.5 py-2 bg-[#2f362f] text-white rounded-md font-semibold hover:bg-[#1f261f] transition-colors flex items-center gap-2"
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
                client.status === "Customer"
                  ? "bg-green-100 text-green-700"
                  : client.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : client.status === "Prospect"
                  ? "bg-blue-100 text-blue-700"
                  : client.status === "Lead"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  client.status === "Customer"
                    ? "bg-green-500"
                    : client.status === "Active"
                    ? "bg-green-500"
                    : client.status === "Prospect"
                    ? "bg-blue-500"
                    : client.status === "Lead"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              />
              {client.status}
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
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
              <p className="text-sm text-[#2f362f]/70">Total Deals</p>
            </div>

            <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEFDFC] flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-[#FEFDFC] px-2 py-1 rounded-full">
                  Pipeline
                </span>
              </div>
              <p className="text-3xl font-bold text-[#2f362f] mb-1">
                {metrics.pipelineValue}
              </p>
              <p className="text-sm text-[#2f362f]/70">Value</p>
            </div>

            <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEFDFC] flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-[#FEFDFC] px-2 py-1 rounded-full">
                  Won
                </span>
              </div>
              <p className="text-3xl font-bold text-[#2f362f] mb-1">
                {metrics.wonDeals}
              </p>
              <p className="text-sm text-[#2f362f]/70">Deals Won</p>
            </div>

            <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEFDFC] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-xs font-semibold text-yellow-600 bg-[#FEFDFC] px-2 py-1 rounded-full">
                  {metrics.completedTasks} Done
                </span>
              </div>
              <p className="text-3xl font-bold text-[#2f362f] mb-1">
                {metrics.openTasks}
              </p>
              <p className="text-sm text-[#2f362f]/70">Open Tasks</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Overview Card */}
              <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm">
                <h2 className="text-xl font-bold text-[#2f362f] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#2f362f]/70" />
                  Client Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#2f362f] uppercase tracking-wide mb-3">
                      Contact Information
                    </h3>
                    {client.email && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Email
                          </p>
                          <p className="text-sm font-medium text-[#2f362f] break-all">
                            {client.email}
                          </p>
                          {client.emailOptOut && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Email Opt-Out
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Phone
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {client.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {client.phone2 && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Phone 2
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {client.phone2}
                          </p>
                        </div>
                      </div>
                    )}
                    {client.fax && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-[#2f362f]/70" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">Fax</p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {client.fax}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Professional Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#2f362f] uppercase tracking-wide mb-3">
                      Professional Details
                    </h3>
                    {client.company && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Company
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {client.company}
                          </p>
                        </div>
                      </div>
                    )}
                    {(client.jobTitle || client.position) && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Job Title
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {client.jobTitle || client.position}
                          </p>
                        </div>
                      </div>
                    )}
                    {client.owner && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Owner
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {client.owner}
                          </p>
                        </div>
                      </div>
                    )}
                    {client.dateOfBirth && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-md bg-[#FEFDFC] flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-xs text-[#2f362f]/60 mb-1">
                            Date of Birth
                          </p>
                          <p className="text-sm font-medium text-[#2f362f]">
                            {new Date(client.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lead Score */}
              {client.leadScore !== undefined && (
                <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm">
                  <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#2f362f]/70" />
                    Lead Score
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-[#2f362f]/70">
                          Score
                        </span>
                        <span
                          className={`text-2xl font-bold ${
                            client.leadScore >= 70
                              ? "text-green-600"
                              : client.leadScore >= 40
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {client.leadScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-[#BCC8BC]/30 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            client.leadScore >= 70
                              ? "bg-green-500"
                              : client.leadScore >= 40
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${client.leadScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {client.reviews > 0 && (
                <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm">
                  <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#2f362f]/70" />
                    Reviews
                  </h2>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < client.reviews
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-[#2f362f]"
                        }`}
                      />
                    ))}
                    <span className="text-lg font-bold text-[#2f362f] ml-2">
                      {client.reviews.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              {client.description && (
                <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm">
                  <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#2f362f]/70" />
                    Description
                  </h2>
                  <p className="text-[#2f362f] leading-relaxed">
                    {client.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {client.tags && client.tags.length > 0 && (
                <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm">
                  <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#2f362f]/70" />
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#FEFDFC] text-blue-700 rounded-md text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
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
              {/* Activity Timeline */}
              <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm">
                <h2 className="text-xl font-bold text-[#2f362f] mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2f362f]/70" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-[#2f362f]">
                        Last Active
                      </p>
                      <p className="text-xs text-[#2f362f]/60">
                        {client.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-[#2f362f]">
                        Joined
                      </p>
                      <p className="text-xs text-[#2f362f]/60">
                        {client.joinDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Deals */}
              <div className="bg-[#FEFDFC] rounded-2xl p-6 border border-[#BCC8BC] shadow-sm">
                <h2 className="text-xl font-bold text-[#2f362f] mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#2f362f]/70" />
                  Recent Deals ({metrics.relatedDeals.length})
                </h2>
                {metrics.relatedDeals.length > 0 ? (
                  <div className="space-y-3">
                    {metrics.relatedDeals.slice(0, 3).map((deal) => (
                      <div
                        key={deal.id}
                        className="p-3 hover:bg-[#f8faf9] rounded-md transition-colors border border-[#BCC8BC]"
                      >
                        <p className="text-sm font-semibold text-[#2f362f] mb-1">
                          {deal.dealName}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-[#2f362f]/60">
                            {deal.dealValue}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              deal.status === "Active"
                                ? "bg-[#FEFDFC] text-blue-700"
                                : deal.status === "Closed Won"
                                ? "bg-[#FEFDFC] text-green-700"
                                : "bg-[#FEFDFC] text-[#2f362f]"
                            }`}
                          >
                            {deal.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#2f362f]/60 text-center py-4">
                    No deals yet
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
        clientName={client.name}
      />
    </>
  );
};

export default ClientDetailPage;
