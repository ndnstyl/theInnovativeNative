import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityChartProps {
  userId: string;
}

interface DayData {
  date: string;
  count: number;
}

const COLOR_SCALE = [
  '#1a1a1a', // 0
  '#003333', // 1-2
  '#006666', // 3-5
  '#009999', // 6-9
  '#00FFFF', // 10+
];

function getColor(count: number): string {
  if (count === 0) return COLOR_SCALE[0];
  if (count <= 2) return COLOR_SCALE[1];
  if (count <= 5) return COLOR_SCALE[2];
  if (count <= 9) return COLOR_SCALE[3];
  return COLOR_SCALE[4];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ userId }) => {
  const { supabaseClient } = useAuth();
  const [data, setData] = useState<DayData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: result } = await supabaseClient
        .rpc('get_activity_heatmap', { p_user_id: userId });

      if (result) {
        setData((result as unknown as { activity_date: string; activity_count: number }[]).map(r => ({
          date: r.activity_date,
          count: r.activity_count,
        })));
      }
    };

    if (userId) fetchData();
  }, [supabaseClient, userId]);

  // Build 90-day grid (13 weeks x 7 days)
  const today = new Date();
  const days: { date: string; count: number; dayOfWeek: number; weekIndex: number }[] = [];

  // Create lookup map
  const countMap = new Map<string, number>();
  data.forEach(d => countMap.set(d.date, d.count));

  // Start from 90 days ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 89);

  for (let i = 0; i < 90; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const weekIndex = Math.floor(i / 7);

    days.push({
      date: dateStr,
      count: countMap.get(dateStr) || 0,
      dayOfWeek,
      weekIndex,
    });
  }

  const totalActivities = days.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="activity-chart">
      <div className="activity-chart__header">
        <h3>Activity</h3>
        <span>{totalActivities} activities in the last 90 days</span>
      </div>

      <div className="activity-chart__grid">
        {days.map((day, i) => (
          <div
            key={day.date}
            className="activity-chart__cell"
            style={{
              backgroundColor: getColor(day.count),
              gridColumn: day.weekIndex + 1,
              gridRow: day.dayOfWeek + 1,
            }}
            title={`${day.date}: ${day.count} activities`}
          />
        ))}
      </div>

      <div className="activity-chart__legend">
        <span>Less</span>
        {COLOR_SCALE.map((color, i) => (
          <div
            key={i}
            className="activity-chart__legend-cell"
            style={{ backgroundColor: color }}
          />
        ))}
        <span>More</span>
      </div>

      <style jsx>{`
        .activity-chart {
          margin-top: 24px;
        }
        .activity-chart__header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 12px;
        }
        .activity-chart__header h3 {
          color: #fff;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        .activity-chart__header span {
          color: #4a4a4a;
          font-size: 12px;
        }
        .activity-chart__grid {
          display: grid;
          grid-template-columns: repeat(13, 1fr);
          grid-template-rows: repeat(7, 1fr);
          gap: 3px;
          max-width: 400px;
        }
        .activity-chart__cell {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 3px;
          min-width: 10px;
        }
        .activity-chart__legend {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          font-size: 11px;
          color: #4a4a4a;
        }
        .activity-chart__legend-cell {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default ActivityChart;
