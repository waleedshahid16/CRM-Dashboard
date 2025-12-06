/* eslint-disable no-unused-vars */
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { statsCardColors } from "../../constants/colorClasses";

const StatsCard = ({
  title,
  number,
  icon: Icon,
  color = "blue",
  trend,
  subtitle,
}) => {
  const colors = statsCardColors[color] || statsCardColors.blue;
  const isPositive = trend > 0;

  return (
    <div className="bg-[#FEFDFC] rounded-lg p-6 border border-[#BCC8BC] hover:border-[#BCC8BC] transition-all duration-300 group relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-300`}
      ></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-14 h-14 rounded-md flex items-center justify-center transition-transform duration-300`}
          >
            <Icon className={`w-7 h-7 ${colors.text}`} />
          </div>
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
              isPositive
                ? "bg-[#FEFDFC] text-green-600"
                : "bg-[#FEFDFC] text-red-600"
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
        </div>

        <div>
          <p className="text-[#2f362f] text-sm font-medium mb-1">{title}</p>
          <h2 className="text-4xl font-bold text-[#2f362f] mb-1">{number}</h2>
          <p className="text-[#2f362f] text-xs">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
