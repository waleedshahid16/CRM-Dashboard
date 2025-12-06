import React from "react";
import { UserPlus, Upload, Download, RefreshCw } from "lucide-react";
import { quickActionColors } from "../../constants/colorClasses";

const QuickActions = ({ onAddClient }) => {
  const actions = [
    {
      icon: UserPlus,
      label: "Add Client",
      color: "blue",
      onClick: onAddClient,
    },
    { icon: Upload, label: "Import", color: "green" },
    { icon: Download, label: "Export", color: "purple" },
    { icon: RefreshCw, label: "Sync", color: "orange" },
  ];


  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all ${
              quickActionColors[action.color]
            }`}
          >
            <action.icon className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
