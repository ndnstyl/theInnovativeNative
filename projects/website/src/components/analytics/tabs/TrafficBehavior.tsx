import React from 'react';
import ScoreCard from '../ScoreCard';
import TrendChart from '../TrendChart';
import DonutChart from '../DonutChart';
import BarChartComponent from '../BarChartComponent';
import DataTable from '../DataTable';

interface TrafficBehaviorProps {
  ga4: {
    summary: { users: number; sessions: number; newUsers: number; bounceRate: number; avgSessionDuration: number; conversions: number };
    trend: Array<{ date: string; users: number; sessions: number }>;
    topPages: Array<{ path: string; views: number; uniqueUsers: number; avgTime: number; bounceRate: number }>;
    sources: Array<{ source: string; sessions: number }>;
    devices: { desktop: number; mobile: number; tablet: number };
    countries: Array<{ country: string; users: number }>;
    realtime: { activeUsers: number };
  };
}

const PAGE_COLUMNS = [
  { key: 'path', label: 'Page', sortable: true, format: 'text' as const },
  { key: 'views', label: 'Views', sortable: true, format: 'number' as const },
  { key: 'uniqueUsers', label: 'Unique Users', sortable: true, format: 'number' as const },
  { key: 'avgTime', label: 'Avg Time (s)', sortable: true, format: 'number' as const },
  { key: 'bounceRate', label: 'Bounce Rate', sortable: true, format: 'percent' as const },
];

const TrafficBehavior: React.FC<TrafficBehaviorProps> = ({ ga4 }) => {
  const returningUsers = ga4.summary.users - ga4.summary.newUsers;
  const newVsReturning = ga4.summary.users > 0
    ? ((ga4.summary.newUsers / ga4.summary.users) * 100).toFixed(1)
    : '0';

  const sourceData = ga4.sources.map((s) => ({ name: s.source.split(' / ')[0], value: s.sessions }));
  const deviceData = [
    { name: 'Desktop', value: ga4.devices.desktop },
    { name: 'Mobile', value: ga4.devices.mobile },
    { name: 'Tablet', value: ga4.devices.tablet },
  ];
  const countryData = ga4.countries.map((c) => ({ name: c.country, value: c.users }));

  return (
    <div>
      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--4">
          <ScoreCard title="Total Users" value={ga4.summary.users} previousValue={1050} format="number" />
          <ScoreCard title="Bounce Rate" value={ga4.summary.bounceRate} previousValue={45.1} format="percent" />
          <ScoreCard title="Avg Session (s)" value={ga4.summary.avgSessionDuration} previousValue={172} format="number" />
          <div className="analytics__scorecard">
            <div className="analytics__scorecard-value" style={{ fontSize: '1.5rem' }}>
              <span className="analytics__realtime">
                <span className="analytics__realtime-dot" />
                {ga4.realtime.activeUsers} active now
              </span>
            </div>
            <div className="analytics__scorecard-label">Realtime Users</div>
          </div>
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card">
          <div className="analytics__chart-card-title">Sessions by Day</div>
          <TrendChart
            data={ga4.trend}
            lines={[
              { key: 'sessions', color: '#00FFFF', name: 'Sessions' },
              { key: 'users', color: 'rgba(0,200,200,0.6)', name: 'Users' },
            ]}
            height={220}
          />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--3">
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Traffic Sources</div>
            <DonutChart
              data={sourceData}
              colors={['#00FFFF', '#0099cc', '#006688', '#004455', '#002233', '#669900']}
              height={220}
            />
          </div>
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Devices</div>
            <DonutChart
              data={deviceData}
              colors={['#00FFFF', '#ff9f43', '#54a0ff']}
              height={220}
            />
          </div>
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Top Countries</div>
            <BarChartComponent
              data={countryData}
              color="#00FFFF"
              height={220}
              horizontal
            />
          </div>
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card-title" style={{ marginBottom: 12 }}>Top Pages</div>
        <DataTable
          columns={PAGE_COLUMNS}
          data={ga4.topPages as unknown as Record<string, unknown>[]}
          searchable
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default TrafficBehavior;
