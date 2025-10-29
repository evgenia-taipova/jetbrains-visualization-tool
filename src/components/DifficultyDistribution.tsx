"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}
const COLORS = ["#420039", "#E83F6F", "#2274A5"];

export function DifficultyDistribution({ data }: Props) {
  return (
    <div className="p-8 w-full h-[600px]">
      <h2 className="text-xl font-bold mb-4">Questions by Difficulty</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Legend layout="vertical" verticalAlign="middle" align="left" />

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
