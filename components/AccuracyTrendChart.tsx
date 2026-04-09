"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "Nov", accuracy: 84 },
  { month: "Dec", accuracy: 83 },
  { month: "Jan", accuracy: 84 },
  { month: "Feb", accuracy: 87 },
  { month: "Mar", accuracy: 86 },
  { month: "Apr", accuracy: 87 },
];

export default function AccuracyTrendChart() {
  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 w-full max-w-2xl">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-white text-lg font-bold">Accuracy Trend</h3>
          <p className="text-gray-500 text-sm">Monthly prediction accuracy</p>
        </div>
        <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20">
          <TrendingUp className="w-5 h-5 text-teal-500" />
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {/* Defining the Teal Gradient */}
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={true} 
              horizontal={true} 
              stroke="#ffffff10" 
            />

            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />

            <YAxis 
              domain={[79, 90]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              ticks={[79, 82, 85, 90]}
            />

            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
              itemStyle={{ color: '#14b8a6' }}
            />

            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="#14b8a6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorAccuracy)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
