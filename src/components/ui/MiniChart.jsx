import { LineChart, Line, YAxis, ResponsiveContainer } from "recharts";

export default function MiniChart({ data, className }) {
  if (!data || data.length < 2) return null;

  const chartData = data.map((v, i) => ({ v, i }));
  const values = data.filter(v => typeof v === 'number');
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = Math.max((maxVal - minVal) * 0.2, 0.5);

  return (
    <div className={className || "w-24 h-12"}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: -20 }}>
          <YAxis
            type="number"
            domain={[minVal - padding, maxVal + padding]}
            hide={true}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="hsl(var(--foreground))"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
