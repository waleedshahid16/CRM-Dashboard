/* eslint-disable react-hooks/static-components */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  FileText,
  Users,
  Briefcase,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Selectors
const selectAllClients = (state) => state?.clients?.clients || [];
const selectAllCompanies = (state) => state?.companies?.companies || [];
const selectAllDeals = (state) => state?.deals?.deals || [];
const selectAllTasks = (state) => state?.tasks?.tasks || [];

const ReportsPage = () => {
  // Navigation
  const navigate = useNavigate();
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chart responsive settings
  const chartHeight = isMobile ? 250 : 300;
  const barSize = isMobile ? 20 : 30;
  const pieOuterRadius = isMobile ? 80 : 100;
  const xAxisAngle = isMobile ? -90 : -45;
  
  // Get data from Redux
  const clients = useSelector(selectAllClients);
  const companies = useSelector(selectAllCompanies);
  const deals = useSelector(selectAllDeals);
  const tasks = useSelector(selectAllTasks);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const activeClients = clients.filter((c) => c.status === "Active").length;
    const activeDeals = deals.filter((d) => d.status === "Active").length;
    const wonDeals = deals.filter((d) => d.status === "Won").length;
    const lostDeals = deals.filter((d) => d.status === "Lost").length;
    const inProgressTasks = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;

    const totalDealValue = deals
      .filter((d) => d.status === "Active" || d.status === "Won")
      .reduce((sum, deal) => {
        const value = parseInt(deal.value?.replace(/[^0-9]/g, "") || "0");
        return sum + value;
      }, 0);

    const winRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;
    const taskCompletionRate =
      tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return {
      activeClients,
      totalClients: clients.length,
      activeDeals,
      wonDeals,
      lostDeals,
      totalDeals: deals.length,
      inProgressTasks,
      completedTasks,
      totalTasks: tasks.length,
      totalDealValue: `$${(totalDealValue / 1000).toFixed(1)}K`,
      winRate: winRate.toFixed(1),
      taskCompletionRate: taskCompletionRate.toFixed(1),
    };
  }, [clients, deals, tasks]);

  // Prepare data for charts
  const dealsByStage = useMemo(() => {
    const stages = [
      "Discovery",
      "Qualification",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ];

    if (!deals || deals.length === 0) {
      return stages.map((stage) => ({ name: stage, count: 0 }));
    }

    return stages.map((stage) => ({
      name: stage,
      count: deals.filter((d) => d.status === stage).length,
    }));
  }, [deals]);

  const dealsByStatus = useMemo(() => {
    if (!deals || deals.length === 0) return [];

    const statusGroups = deals.reduce((acc, deal) => {
      const status = deal.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
    }));
  }, [deals]);

  // Updated tasksByStatus to match TasksPage statuses: Active, On Hold, Completed, Cancelled
  const tasksByStatus = useMemo(() => {
    const statuses = ["Active", "On Hold", "Completed", "Cancelled"];

    if (!tasks || tasks.length === 0) {
      return statuses.map((status) => ({ name: status, count: 0 }));
    }

    return statuses.map((status) => ({
      name: status,
      count: tasks.filter((t) => t.status === status).length,
    }));
  }, [tasks]);

  // Chart colors
  const COLORS = {
    primary: ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    // Task status colors matching TasksPage
    taskStatus: {
      Active: "#3b82f6", // Blue
      "On Hold": "#f59e0b", // Yellow
      Completed: "#10b981", // Green
      Cancelled: "#ef4444", // Red
    },
  };

  // Helper component for summary cards
  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
    const colorClasses = {
      blue: { bg: "bg-[#FEFDFC]", text: "text-blue-600" },
      green: { bg: "bg-[#FEFDFC]", text: "text-green-600" },
      purple: { bg: "bg-[#FEFDFC]", text: "text-purple-600" },
      orange: { bg: "bg-[#FEFDFC]", text: "text-orange-600" },
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
      <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
          {trend && (
            <span
              className={`text-sm font-medium ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-[#2f362f] mb-1">{value}</h3>
        <p className="text-sm text-[#2f362f]">{title}</p>
        {subtitle && <p className="text-xs text-[#2f362f] mt-1">{subtitle}</p>}
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2f362f] mb-3">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-[#2f362f]/60  transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Reports</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#2f362f] mb-2">
              Business Intelligence Reports
            </h1>
            <p className="text-[#2f362f]">
              Comprehensive overview of your business performance and metrics
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-blue-200 text-[#2f362f] rounded-md transition-colors font-semibold">
              Export as PDF
            </button>
            <button className="px-4 py-2.5 border border-[#BCC8BC] rounded-md  transition-colors">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Report
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          title="Total Revenue"
          value={summary.totalDealValue}
          icon={DollarSign}
          color="green"
          trend={5.2}
          subtitle="From active and won deals"
        />
        <StatCard
          title="Active Clients"
          value={`${summary.activeClients} / ${summary.totalClients}`}
          icon={Users}
          color="blue"
          trend={12.5}
          subtitle="Active out of total"
        />
        <StatCard
          title="Deal Win Rate"
          value={`${summary.winRate}%`}
          icon={TrendingUp}
          color="purple"
          trend={3.8}
          subtitle="Success rate of deals"
        />
        <StatCard
          title="Tasks Completed"
          value={`${summary.completedTasks} / ${summary.totalTasks}`}
          icon={CheckCircle}
          color="orange"
          trend={8.1}
          subtitle="Completed out of total"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Deals by Stage */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Deals by Stage
              </h3>
              <p className="text-sm text-[#2f362f]">
                Current pipeline distribution
              </p>
            </div>
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-80">
            <div className="w-full" style={{ height: `${chartHeight}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dealsByStage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={xAxisAngle}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 100 : 80}
                    interval={0}
                    minTickGap={isMobile ? -10 : 0}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#667eea"
                    radius={[4, 4, 0, 0]}
                    name="Number of Deals"
                    barSize={barSize}
                    style={{
                      filter: 'drop-shadow(0 2px 2px rgba(102, 126, 234, 0.2))'
                    }}
                  >
                    {dealsByStage.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS.primary[index % COLORS.primary.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Deals by Status */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Deals by Status
              </h3>
              <p className="text-sm text-[#2f362f]">
                Status distribution of all deals
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="h-80">
            {dealsByStatus.length > 0 ? (
              <div className="w-full" style={{ height: `${chartHeight}px` }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dealsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        isMobile ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={pieOuterRadius}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dealsByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Won"
                              ? COLORS.success
                              : entry.name === "Active"
                              ? COLORS.info
                              : entry.name === "Lost"
                              ? COLORS.danger
                              : COLORS.primary[index % COLORS.primary.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [value, `${name} Deals`]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[#2f362f]">
                No deal data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Overview and Recent Activity in a row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tasks Overview */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC] h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">Tasks Overview</h3>
              <p className="text-sm text-[#2f362f]">
                Distribution of tasks by status
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64">
            <div className="w-full" style={{ height: `${chartHeight}px` }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                    name="Number of Tasks"
                    barSize={barSize}
                    style={{
                      filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.1))'
                    }}
                  >
                    {tasksByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS.taskStatus[entry.name] ||
                          COLORS.primary[index % COLORS.primary.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC] h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Recent Activity
              </h3>
              <p className="text-sm text-[#2f362f]">
                Latest updates across the system
              </p>
            </div>
            <Clock className="w-5 h-5 text-[#2f362f]" />
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors duration-200">
            {[...deals, ...tasks, ...clients].slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-start p-3 rounded-lg transition-colors hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <div className="p-2 bg-blue-50 rounded-lg mr-4 flex-shrink-0 border border-blue-100">
                  {item.dealName ? (
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  ) : item.title ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Users className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#2f362f] truncate">
                    {item.dealName || item.title || item.name || "New item"}
                  </h4>
                  <p className="text-sm text-[#2f362f] truncate">
                    {item.status && `Status: ${item.status} • `}
                    {item.dealValue && `Value: ${item.dealValue} • `}
                    {item.dueDate && `Due: ${item.dueDate}`}
                  </p>
                </div>
                <span className="text-xs text-[#2f362f] whitespace-nowrap ml-2 text-opacity-70">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
