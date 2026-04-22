import React from 'react';
import ScoreCard from '../ScoreCard';
import DataTable from '../DataTable';
import DonutChart from '../DonutChart';

interface LinkIntelligenceProps {
  sink: {
    summary: { totalLinks: number; totalClicks: number; clicksToday: number; avgClicksPerLink: number };
    topLinks: Array<{ slug: string; destination: string; clicks: number; lastClick: string; tags: string[] }>;
    byReferrer: Array<{ referrer: string; clicks: number }>;
    byDevice: { mobile: number; desktop: number; tablet: number };
  };
}

const LINK_COLUMNS = [
  { key: 'slug', label: 'Slug', sortable: true, format: 'text' as const },
  { key: 'destination', label: 'Destination', sortable: false, format: 'text' as const },
  { key: 'clicks', label: 'Clicks', sortable: true, format: 'number' as const },
  { key: 'lastClick', label: 'Last Click', sortable: true, format: 'text' as const },
  { key: 'tagsStr', label: 'Tags', sortable: false, format: 'text' as const },
];

const LinkIntelligence: React.FC<LinkIntelligenceProps> = ({ sink }) => {
  const referrerData = sink.byReferrer.map((r) => ({ name: r.referrer, value: r.clicks }));
  const deviceData = [
    { name: 'Mobile', value: sink.byDevice.mobile },
    { name: 'Desktop', value: sink.byDevice.desktop },
    { name: 'Tablet', value: sink.byDevice.tablet },
  ];

  const tableData = sink.topLinks.map((l) => ({
    ...l,
    tagsStr: l.tags.join(', '),
    lastClick: l.lastClick.split('T')[0],
  }));

  return (
    <div>
      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--4">
          <ScoreCard title="Total Links" value={sink.summary.totalLinks} format="number" />
          <ScoreCard title="Total Clicks" value={sink.summary.totalClicks} previousValue={1620} format="number" />
          <ScoreCard title="Clicks Today" value={sink.summary.clicksToday} previousValue={38} format="number" />
          <ScoreCard title="Avg Clicks / Link" value={sink.summary.avgClicksPerLink} previousValue={64.8} format="number" />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card-title" style={{ marginBottom: 12 }}>Top Links</div>
        <DataTable
          columns={LINK_COLUMNS}
          data={tableData as unknown as Record<string, unknown>[]}
          searchable
          pageSize={10}
        />
      </div>

      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--2">
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Clicks by Referrer</div>
            <DonutChart
              data={referrerData}
              colors={['#00FFFF', '#0099cc', '#006688', '#004455', '#002233', '#669900']}
              height={240}
            />
          </div>
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Clicks by Device</div>
            <DonutChart
              data={deviceData}
              colors={['#ff9f43', '#00FFFF', '#54a0ff']}
              height={240}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkIntelligence;
