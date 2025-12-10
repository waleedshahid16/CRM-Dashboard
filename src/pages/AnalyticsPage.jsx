/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Briefcase,
  Target,
  Award,
  Activity,
  Clock,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock selectors - replace with your actual selectors
const selectAllClients = (state) => state?.clients?.clients || [];
const selectAllCompanies = (state) => state?.companies?.companies || [];
const selectAllDeals = (state) => state?.deals?.deals || [];
const selectAllTasks = (state) => state?.tasks?.tasks || [];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  // Get data from Redux
  const clients = useSelector(selectAllClients);
  const companies = useSelector(selectAllCompanies);
  const deals = useSelector(selectAllDeals);
  const tasks = useSelector(selectAllTasks);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const activeClients = clients.filter((c) => c.status === "Active").length;
    const activeDeals = deals.filter((d) => d.status === "Active").length;
    const wonDeals = deals.filter((d) => d.status === "Won").length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;

    const totalDealValue = deals
      .filter((d) => d.status === "Active")
      .reduce((sum, deal) => {
        const value = parseInt(deal.value?.replace(/[^0-9]/g, "") || "0");
        return sum + value;
      }, 0);

    const avgDealValue = activeDeals > 0 ? totalDealValue / activeDeals : 0;

    const winRate = deals.length > 0 ? (wonDeals / deals.length) * 100 : 0;

    return {
      activeClients,
      activeDeals,
      wonDeals,
      completedTasks,
      totalDealValue: `$${(totalDealValue / 1000).toFixed(0)}K`,
      avgDealValue: `$${(avgDealValue / 1000).toFixed(0)}K`,
      winRate: winRate.toFixed(1),
      taskCompletionRate:
        tasks.length > 0
          ? ((completedTasks / tasks.length) * 100).toFixed(1)
          : 0,
    };
  }, [clients, deals, tasks]);

  // Deals by Stage
  const dealsByStage = useMemo(() => {
    const stages = [
      "Discovery",
      "Qualification",
      "Proposal",
      "Negotiation",
      "Closed Won",
      "Closed Lost",
    ];

    // If no deals, return array with 0 counts
    if (!deals || deals.length === 0) {
      return stages.map((stage) => ({ name: stage, count: 0 }));
    }

    return stages.map((stage) => ({
      name: stage,
      count: deals.filter((d) => d.status === stage).length,
    }));
  }, [deals]);

  // Deals by Status (Pie Chart)
  const dealsByStatus = useMemo(() => {
    // If no deals, return empty array
    if (!deals || deals.length === 0) {
      return [];
    }

    // Group by status
    const statusGroups = deals.reduce((acc, deal) => {
      const status = deal.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Convert to array of objects for the chart
    return Object.entries(statusGroups).map(([name, value]) => ({
      name,
      value,
    }));
  }, [deals]);

  // Companies by Industry
  const companiesByIndustry = useMemo(() => {
    const industries = {};
    companies.forEach((company) => {
      industries[company.industry] = (industries[company.industry] || 0) + 1;
    });
    return Object.entries(industries)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [companies]);

  // Tasks by Priority
  const tasksByPriority = useMemo(() => {
    return ["Low", "Medium", "High"].map((priority) => ({
      name: priority,
      count: tasks.filter(
        (t) => t.priority === priority && t.status !== "Completed"
      ).length,
    }));
  }, [tasks]);

  // Monthly Deals Trend (mock data - in real app, calculate from dates)
  const monthlyTrend = useMemo(() => {
    return [
      { month: "Jul", deals: 8, value: 450 },
      { month: "Aug", deals: 12, value: 680 },
      { month: "Sep", deals: 10, value: 590 },
      { month: "Oct", deals: 15, value: 820 },
      { month: "Nov", deals: 18, value: 950 },
      {
        month: "Dec",
        deals: deals.length,
        value: parseInt(kpis.totalDealValue.replace(/[^0-9]/g, "")),
      },
    ];
  }, [deals, kpis.totalDealValue]);

  // Chart colors
  const COLORS = {
    primary: ["#667eea", "#764ba2", "#f093fb", "#4facfe"],
    status: {
      Active: "#3b82f6",
      Won: "#10b981",
      Lost: "#ef4444",
    },
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => {
    const colorClasses = {
      blue: {
        bg: "bg-[#FEFDFC]",
        light: "bg-[#FEFDFC]",
        text: "text-blue-600",
        gradient: "from-blue-500 to-blue-600",
      },
      green: {
        bg: "bg-[#FEFDFC]",
        light: "bg-[#FEFDFC]",
        text: "text-green-600",
        gradient: "from-green-500 to-green-600",
      },
      purple: {
        bg: "bg-[#FEFDFC]",
        light: "bg-[#FEFDFC]",
        text: "text-purple-600",
        gradient: "from-purple-500 to-purple-600",
      },
      orange: {
        bg: "bg-[#FEFDFC]",
        light: "bg-[#FEFDFC]",
        text: "text-orange-600",
        gradient: "from-orange-500 to-orange-600",
      },
    };

    const colors = colorClasses[color] || colorClasses.blue;
    const isPositive = trend > 0;

    return (
      <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC] transition-all duration-300 group relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-linear-to-br ${colors.gradient} opacity-0  transition-opacity duration-300`}
        ></div>
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-14 h-14 rounded-lg flex items-center justify-center ${colors.light}  transition-transform duration-300`}
            >
              <Icon className={`w-7 h-7 ${colors.text}`} />
            </div>
            {trend !== undefined && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  isPositive
                    ? "bg-[#FEFDFC] text-green-700"
                    : "bg-[#FEFDFC] text-red-700"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isPositive ? "+" : ""}
                {trend}%
              </div>
            )}
          </div>
          <div>
            <p className="text-[#2f362f] text-sm font-medium mb-1">{title}</p>
            <h2 className="text-4xl font-bold text-[#2f362f] mb-1">{value}</h2>
            {subtitle && <p className="text-[#2f362f] text-xs">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2f362f] mb-3">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[#2f362f]/60  transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-[#2f362f] font-medium">Analytics</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#2f362f] mb-2 tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-[#2f362f] text-lg">
              Comprehensive insights into your business performance
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2.5 border border-[#BCC8BC] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Revenue"
          value={kpis.totalDealValue}
          icon={DollarSign}
          color="green"
          trend={15}
          subtitle="From active deals"
        />
        <StatCard
          title="Active Clients"
          value={kpis.activeClients}
          icon={Users}
          color="blue"
          trend={8}
          subtitle="Currently engaged"
        />
        <StatCard
          title="Win Rate"
          value={`${kpis.winRate}%`}
          icon={Target}
          color="purple"
          trend={5}
          subtitle="Deals closed successfully"
        />
        <StatCard
          title="Avg Deal Value"
          value={kpis.avgDealValue}
          icon={Award}
          color="orange"
          trend={12}
          subtitle="Per active deal"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {/* Deals by Stage */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Deals by Stage
              </h3>
              <p className="text-sm text-[#2f362f] mt-1">
                Current pipeline distribution
              </p>
            </div>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealsByStage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
                barSize={30}
                style={{
                  filter: 'drop-shadow(0 2px 2px rgba(102, 126, 234, 0.2))'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Deals by Status (Pie) */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Deals by Status
              </h3>
              <p className="text-sm text-[#2f362f] mt-1">Status distribution</p>
            </div>
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dealsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dealsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS.status[entry.name] || COLORS.primary[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
        {/* Monthly Trend */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Monthly Performance
              </h3>
              <p className="text-sm text-[#2f362f] mt-1">
                Deal count and value trends
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#667eea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="deals"
                stroke="#667eea"
                fillOpacity={1}
                fill="url(#colorDeals)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Companies by Industry */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Companies by Industry
              </h3>
              <p className="text-sm text-[#2f362f] mt-1">Top 6 industries</p>
            </div>
            <Briefcase className="w-5 h-5 text-orange-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={companiesByIndustry} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#f97316" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Tasks by Priority */}
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">Active Tasks</h3>
              <p className="text-sm text-[#2f362f] mt-1">By priority level</p>
            </div>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="space-y-4">
            {tasksByPriority.map((item, index) => {
              const colors = {
                High: {
                  bg: "bg-red-100",
                  bar: "bg-red-500",
                  text: "text-red-700",
                },
                Medium: {
                  bg: "bg-yellow-100",
                  bar: "bg-yellow-500",
                  text: "text-yellow-700",
                },
                Low: {
                  bg: "bg-green-100",
                  bar: "bg-green-500",
                  text: "text-green-700",
                },
              };
              const color = colors[item.name];
              const maxCount = Math.max(
                ...tasksByPriority.map((t) => t.count),
                1
              );
              const percentage = (item.count / maxCount) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#2f362f]">
                      {item.name}
                    </span>
                    <span className={`text-sm font-bold ${color.text}`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className={`${color.bar} h-2.5 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-2 bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#2f362f]">
                Quick Statistics
              </h3>
              <p className="text-sm text-[#2f362f] mt-1">
                Overview of key metrics
              </p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#2f362f]">Total Clients</p>
                  <p className="text-2xl font-bold text-[#2f362f]">
                    {clients.length}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#2f362f]">
                {kpis.activeClients} active clients
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-md border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#2f362f]">Total Companies</p>
                  <p className="text-2xl font-bold text-[#2f362f]">
                    {companies.length}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#2f362f]">
                {companies.filter((c) => c.status === "Active").length} active
                companies
              </p>
            </div>

            <div className="p-4 bg-[#FEFDFC] rounded-md border border-[#BCC8BC]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#2f362f]">Total Deals</p>
                  <p className="text-2xl font-bold text-[#2f362f]">
                    {deals.length}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#2f362f]">
                {kpis.wonDeals} deals won
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-md border border-orange-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#2f362f]">Task Completion</p>
                  <p className="text-2xl font-bold text-[#2f362f]">
                    {kpis.taskCompletionRate}%
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#2f362f]">
                {kpis.completedTasks} of {tasks.length} tasks done
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
