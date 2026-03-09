import React from 'react';
import { useCourseAnalytics } from '@/hooks/useCourseAnalytics';
import AdminConsumptionReport from './AdminConsumptionReport';

interface CourseAnalyticsDashboardProps {
  courseId: string;
  courseTitle: string;
}

/**
 * Admin analytics dashboard with high-level metrics + student engagement table.
 */
const CourseAnalyticsDashboard: React.FC<CourseAnalyticsDashboardProps> = ({
  courseId,
  courseTitle,
}) => {
  const { analytics, students, loading } = useCourseAnalytics(courseId);

  if (loading) {
    return (
      <div className="classroom-analytics">
        <div className="classroom-analytics__loading">
          <div className="classroom-loading__spinner" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalEnrollments = analytics?.total_enrollments ?? students.length;
  const activeLearners = analytics?.active_learners_7d ?? students.filter((s) => {
    if (!s.last_active) return false;
    const diff = Date.now() - new Date(s.last_active).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;
  const avgCompletion = analytics?.avg_completion_pct ??
    (students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.progress_pct, 0) / students.length)
      : 0);
  const completedCount = students.filter((s) => s.progress_pct === 100).length;

  return (
    <div className="classroom-analytics">
      <h2 className="classroom-analytics__title">
        Analytics: {courseTitle}
      </h2>

      {analytics?.computed_at && (
        <p className="classroom-analytics__updated">
          Last computed: {new Date(analytics.computed_at).toLocaleString()}
        </p>
      )}

      <div className="classroom-analytics__cards">
        <div className="classroom-analytics__card">
          <span className="classroom-analytics__card-value">{totalEnrollments}</span>
          <span className="classroom-analytics__card-label">Total Enrollments</span>
        </div>
        <div className="classroom-analytics__card">
          <span className="classroom-analytics__card-value">{activeLearners}</span>
          <span className="classroom-analytics__card-label">Active (7d)</span>
        </div>
        <div className="classroom-analytics__card">
          <span className="classroom-analytics__card-value">{avgCompletion}%</span>
          <span className="classroom-analytics__card-label">Avg. Completion</span>
        </div>
        <div className="classroom-analytics__card">
          <span className="classroom-analytics__card-value">{completedCount}</span>
          <span className="classroom-analytics__card-label">Graduated</span>
        </div>
      </div>

      {/* Completion distribution mini-chart */}
      <div className="classroom-analytics__distribution">
        <h3>Completion Distribution</h3>
        <div className="classroom-analytics__bars">
          {[
            { label: '0-25%', count: students.filter((s) => s.progress_pct <= 25).length },
            { label: '26-50%', count: students.filter((s) => s.progress_pct > 25 && s.progress_pct <= 50).length },
            { label: '51-75%', count: students.filter((s) => s.progress_pct > 50 && s.progress_pct <= 75).length },
            { label: '76-99%', count: students.filter((s) => s.progress_pct > 75 && s.progress_pct < 100).length },
            { label: '100%', count: completedCount },
          ].map((bucket) => {
            const maxCount = Math.max(...students.map((s) => 1), totalEnrollments);
            const pct = maxCount > 0 ? Math.round((bucket.count / maxCount) * 100) : 0;
            return (
              <div key={bucket.label} className="classroom-analytics__bar-group">
                <div className="classroom-analytics__bar-track">
                  <div
                    className="classroom-analytics__bar-fill"
                    style={{ height: `${Math.max(pct, 4)}%` }}
                  />
                </div>
                <span className="classroom-analytics__bar-label">{bucket.label}</span>
                <span className="classroom-analytics__bar-count">{bucket.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AdminConsumptionReport courseId={courseId} />
    </div>
  );
};

export default CourseAnalyticsDashboard;
