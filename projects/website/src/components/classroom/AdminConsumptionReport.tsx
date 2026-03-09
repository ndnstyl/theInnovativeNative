import React from 'react';
import { useCourseAnalytics } from '@/hooks/useCourseAnalytics';
import type { StudentEngagement } from '@/hooks/useCourseAnalytics';

interface AdminConsumptionReportProps {
  courseId: string;
}

/**
 * Per-student engagement report for course admins.
 */
const AdminConsumptionReport: React.FC<AdminConsumptionReportProps> = ({ courseId }) => {
  const { students, loading } = useCourseAnalytics(courseId);

  if (loading) {
    return (
      <div className="classroom-admin-report">
        <div className="classroom-loading__spinner" style={{ width: 24, height: 24 }} />
        <p>Loading student data...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="classroom-admin-report">
        <p className="classroom-admin-report__empty">No students enrolled yet.</p>
      </div>
    );
  }

  return (
    <div className="classroom-admin-report">
      <h3 className="classroom-admin-report__heading">
        Student Progress ({students.length} enrolled)
      </h3>

      <div className="classroom-admin-report__table-wrapper">
        <table className="classroom-admin-report__table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Progress</th>
              <th>Lessons</th>
              <th>Enrolled</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <StudentRow key={s.user_id} student={s} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudentRow: React.FC<{ student: StudentEngagement }> = ({ student }) => {
  const formatDate = (d: string | null) => {
    if (!d) return '--';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <tr>
      <td>
        <div className="classroom-admin-report__student">
          {student.avatar_url ? (
            <img
              src={student.avatar_url}
              alt={student.display_name}
              className="classroom-admin-report__avatar"
            />
          ) : (
            <span className="classroom-admin-report__avatar-placeholder">
              {student.display_name.charAt(0).toUpperCase()}
            </span>
          )}
          <span>{student.display_name}</span>
        </div>
      </td>
      <td>
        <div className="classroom-admin-report__progress">
          <div className="classroom-admin-report__progress-track">
            <div
              className="classroom-admin-report__progress-fill"
              style={{ width: `${student.progress_pct}%` }}
            />
          </div>
          <span>{student.progress_pct}%</span>
        </div>
      </td>
      <td>{student.completed_lessons}/{student.total_lessons}</td>
      <td>{formatDate(student.enrolled_at)}</td>
      <td>{formatDate(student.last_active)}</td>
    </tr>
  );
};

export default AdminConsumptionReport;
