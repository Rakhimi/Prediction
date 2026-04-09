"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock } from "lucide-react";

const data = [
  { day: "Thu", volume: 52 },
  { day: "Fri", volume: 38 },
  { day: "Sat", volume: 72 },
  { day: "Sun", volume: 66 },
  { day: "Mon", volume: 40 },
  { day: "Tue", volume: 46 },
  { day: "Wed", volume: 40 },
];

export default function WeeklyActivityChart() {
  return (
    <div className="w-full bg-[#111] p-6 rounded-2xl border border-teal-500/10">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-white text-xl font-bold font-cuprum">Weekly Activity</h3>
          <p className="text-gray-500 text-sm">Daily prediction volume</p>
        </div>
        <div className="p-2 bg-teal-500/10 rounded-full border border-teal-500/20">
          <Clock className="w-5 h-5 text-teal-500" />
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20, right: 10 }}>
            <CartesianGrid 
              vertical={true} 
              horizontal={true} 
              stroke="#ffffff05" // Very subtle grid lines
            />
            
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            
            <YAxis 
              domain={[0, 80]} 
              ticks={[0, 20, 40, 60, 80]}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 12 }}
            />

            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
              itemStyle={{ color: '#14b8a6' }}
              cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '5 5' }}
            />

            <Line
              type="monotone"
              dataKey="volume"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ 
                fill: '#14b8a6', 
                r: 6, 
                strokeWidth: 2, 
                stroke: '#111' // Creates the gap effect around the dot
              }}
              activeDot={{ 
                r: 8, 
                fill: '#14b8a6',
                stroke: '#fff',
                strokeWidth: 2 
              }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
