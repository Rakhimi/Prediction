"use client";

import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

const data = [
  { name: "Home Win", value: 42, color: "#14b8a6", fill: "#14b8a6" }, // teal
  { name: "Draw", value: 23, color: "#f59e0b", fill: "#f59e0b" },     // amber
  { name: "Away Win", value: 35, color: "#f43f5e", fill: "#f43f5e" }, // rose
];

const stats = [
  { label: "Wins", value: 42, color: "text-teal-400" },
  { label: "Draws", value: 23, color: "text-amber-400" },
  { label: "Losses", value: 35, color: "text-rose-400" },
];

export default function PredictionDistribution() {
  return (
    <div className="bg-[#111] p-8 rounded-2xl border border-teal-500/10 w-full max-w-2xl text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold font-cuprum tracking-tight">
            Prediction Distribution
          </h2>
          <p className="text-gray-500 text-sm">
            Outcome breakdown & statistics
          </p>
        </div>
        <div className="p-2 bg-teal-500/5 rounded-xl border border-teal-500/20">
          <BarChart3 className="w-6 h-6 text-teal-400/70" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
        {/* Donut Chart */}
        <div className="relative h-[200px] w-full flex items-center justify-center">
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <span className="text-4xl font-bold font-cuprum">102K</span>
            <span className="text-[10px] uppercase text-gray-500 tracking-widest">
              Total Matches
            </span>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Bars */}
        <div className="space-y-6">
          {data.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-semibold text-gray-300">
                    {item.name}
                  </span>
                </div>

                <span
                  className="text-xl font-bold"
                  style={{ color: item.color }}
                >
                  {item.value}%
                </span>
              </div>

              <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.value}%`,
                    background: `linear-gradient(to right, ${item.color}, ${item.color}aa)`,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-tighter">
                <span>
                  {Math.floor(item.value * 1020).toLocaleString()} matches
                </span>
                <span
                  className={
                    item.value > 30 ? "text-teal-400" : "text-teal-700"
                  }
                >
                  {item.value > 30 ? "↑ 5%" : "↓ 3%"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center"
          >
            <div className={`text-2xl font-bold font-cuprum ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}