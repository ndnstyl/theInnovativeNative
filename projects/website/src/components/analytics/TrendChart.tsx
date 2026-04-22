import React, { useState, useEffect } from 'react';

interface LineConfig {
  key: string;
  color: string;
  name: string;
}

interface TrendChartProps {
  data: Array<{ date: string; [key: string]: number | string }>;
  lines: LineConfig[];
  height?: number;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, lines, height = 220 }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === 'undefined') {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
        Loading chart...
      </div>
    );
  }

  const {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
  } = require('recharts');

  const shortDate = (d: string) => {
    const parts = d.split('-');
    return `${parts[1]}/${parts[2]}`;
  };

  const displayData = data.filter((_, i) => i % Math.ceil(data.length / 15) === 0 || i === data.length - 1);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tickFormatter={shortDate}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          tickLine={false}
          interval={Math.ceil(data.length / 8) - 1}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: '#fff',
            fontSize: 12,
          }}
          labelFormatter={shortDate}
          labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', paddingTop: 12 }}
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            name={l.name}
            activeDot={{ r: 4, fill: l.color }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
