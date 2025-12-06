import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import StatsCard from "../components/shared/StatsCard";
import { Users, Briefcase, CheckCircle2 } from "lucide-react";
import { selectTotalClients } from "../store/slices/clientsSlice";
import { selectActiveDeals, selectAllDeals } from "../store/slices/dealsSlice";
import { selectAllTasks } from "../store/slices/tasksSlice";
import { selectAllCompanies } from "../store/slices/companiesSlice";

const Dashboard = () => {
  const totalClients = useSelector(selectTotalClients);
  const activeDeals = useSelector(selectActiveDeals);
  const allCompanies = useSelector(selectAllCompanies);
  const deals = useSelector(selectAllDeals);
  const tasks = useSelector(selectAllTasks);

  const activeCompanies = useMemo(
    () => allCompanies.filter((c) => c.status === "Active").length,
    [allCompanies]
  );

  const recentDeals = useMemo(() => {
    return [...deals]
      .sort(
        (a, b) =>
          new Date(b.createdDate || 0).getTime() -
          new Date(a.createdDate || 0).getTime()
      )
      .slice(0, 4);
  }, [deals]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.status !== "Completed")
      .sort(
        (a, b) =>
          new Date(a.dueDate || 0).getTime() -
          new Date(b.dueDate || 0).getTime()
      )
      .slice(0, 4);
  }, [tasks]);

  return (
    <div className="p-4 lg:p-8 max-w-[1600px] mx-auto bg-[#f8faf9] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#2f362f] mb-3">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">Overview</span>
        </div>
        <h1 className="text-4xl font-bold text-[#2f362f] mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-[#2f362f] text-lg">
          Welcome back! Here's your business overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <StatsCard
          title="Total Clients"
          number={totalClients.total}
          icon={Users}
          color="blue"
          trend={12}
          subtitle="Active accounts"
        />
        <StatsCard
          title="Active Companies"
          number={activeCompanies}
          icon={Briefcase}
          color="purple"
          trend={5}
          subtitle="Operating companies"
        />
        <StatsCard
          title="Active Deals"
          number={activeDeals.active}
          icon={CheckCircle2}
          color="orange"
          trend={3}
          subtitle="In progress"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
        <div className="bg-[#FEFDFC] rounded-lg p-6 shadow-sm border border-[#BCC8BC]">
          <h3 className="text-lg font-bold text-[#2f362f] mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Recent Deals
          </h3>
          {recentDeals.length > 0 ? (
            <div className="space-y-3">
              {recentDeals.map((deal) => {
                const formattedValue = deal.dealValue
                  ? `$${Number(deal.dealValue).toLocaleString()}`
                  : "N/A";
                return (
                  <div
                    key={deal.id}
                    className="flex items-start justify-between p-3 hover:bg-[#FEFDFC] rounded-md transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-semibold text-[#2f362f]">
                        {deal.dealName || "Unnamed Deal"}
                      </p>
                      <p className="text-xs text-[#2f362f]">
                        {deal.contact || "No contact"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#2f362f]">
                        {formattedValue}
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold ${
                          deal.status === "Closed Won"
                            ? "bg-green-100 text-green-700"
                            : deal.status === "Closed Lost"
                            ? "bg-red-100 text-red-700"
                            : "bg-[#FEFDFC] text-[#2f362f]"
                        }`}
                      >
                        {deal.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#2f362f]">No recent deals to show.</p>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-[#FEFDFC] rounded-md p-6 shadow-sm border border-[#BCC8BC]">
          <h3 className="text-lg font-bold text-[#2f362f] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Upcoming Tasks
          </h3>
          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between p-3 hover:bg-[#FEFDFC] rounded-md transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-semibold text-[#2f362f]">
                      {task.title}
                    </p>
                    <p className="text-xs text-[#2f362f]">
                      Assigned to {task.assignedTo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#2f362f] mb-1">
                      Due {task.dueDate}
                    </p>
                    <span className="inline-flex px-3 py-1 rounded-md text-xs font-semibold bg-[#FEFDFC] text-[#2f362f]">
                      {task.priority} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#2f362f]">
              No upcoming tasks right now.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
