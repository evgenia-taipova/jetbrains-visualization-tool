"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface Props {
  categoryDistribution: { name: string; value: number }[];
}

export function CategoryDistribution({ categoryDistribution }: Props) {
  return (
    <div className="p-8 w-full h-[600px]">
      <h2 className="text-xl font-bold mb-4">Questions by Category</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={categoryDistribution}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" interval={0} />
          <Tooltip />
          <Bar dataKey="value" barSize={30} fill="#f87171">
            <LabelList dataKey="value" fill="black" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
