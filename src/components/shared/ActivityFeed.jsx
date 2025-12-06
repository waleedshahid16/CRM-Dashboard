import React from "react";
import { Clock, UserPlus, UserX, Edit } from "lucide-react";
import { activityColors } from "../../constants/colorClasses";
import { activities as activityData } from "../../data/activityData";

const ActivityFeed = () => {
  const activities = activityData;

 

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
        <Clock className="w-4 h-4 text-slate-400" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                activityColors[activity.color]
              }`}
            >
              <activity.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {activity.text}
              </p>
              <p className="text-sm text-slate-500">{activity.subtext}</p>
              <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        View All Activity
      </button>
    </div>
  );
};

export default ActivityFeed;
