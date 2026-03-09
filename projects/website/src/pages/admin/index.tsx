import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MetricCard from '@/components/admin/MetricCard';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

const METRIC_CONFIG: Record<string, { icon: string; format?: 'number' | 'percent' | 'currency' }> = {
  total_members: { icon: 'fa-solid fa-users' },
  active_members_7d: { icon: 'fa-solid fa-user-check' },
  new_members_7d: { icon: 'fa-solid fa-user-plus' },
  total_posts: { icon: 'fa-solid fa-file-alt' },
  total_comments: { icon: 'fa-solid fa-comments' },
  engagement_rate: { icon: 'fa-solid fa-chart-line', format: 'percent' },
  pending_reports: { icon: 'fa-solid fa-flag' },
  events_this_week: { icon: 'fa-solid fa-calendar' },
};

function formatLabel(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default function AdminDashboard() {
  const { metrics, loading } = useAdminMetrics();

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="admin-loading"><div className="admin-loading__spinner" /></div>
      ) : metrics.length === 0 ? (
        <div className="admin-dashboard__empty">
          <div className="metric-grid">
            {Object.entries(METRIC_CONFIG).map(([key, config]) => (
              <MetricCard
                key={key}
                label={formatLabel(key)}
                value={0}
                icon={config.icon}
                format={config.format}
              />
            ))}
          </div>
          <p className="admin-dashboard__note">
            Metrics will populate once analytics snapshots are computed.
          </p>
        </div>
      ) : (
        <div className="metric-grid">
          {metrics.map(m => {
            const config = METRIC_CONFIG[m.metric_name] || { icon: 'fa-solid fa-chart-bar' };
            return (
              <MetricCard
                key={m.metric_name}
                label={formatLabel(m.metric_name)}
                value={m.current_value}
                trend={m.trend_percentage}
                trendDirection={m.trend_direction}
                icon={config.icon}
                format={config.format}
              />
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
