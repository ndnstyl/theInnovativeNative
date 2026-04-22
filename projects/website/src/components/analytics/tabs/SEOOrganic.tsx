import React from 'react';
import ScoreCard from '../ScoreCard';
import TrendChart from '../TrendChart';
import DataTable from '../DataTable';

interface SEOOrganicProps {
  gsc: {
    summary: { clicks: number; impressions: number; ctr: number; avgPosition: number };
    trend: Array<{ date: string; clicks: number; impressions: number }>;
    queries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>;
    pages: Array<{ page: string; clicks: number; impressions: number; ctr: number; position: number }>;
  };
}

const QUERY_COLUMNS = [
  { key: 'query', label: 'Query', sortable: true, format: 'text' as const },
  { key: 'clicks', label: 'Clicks', sortable: true, format: 'number' as const },
  { key: 'impressions', label: 'Impressions', sortable: true, format: 'number' as const },
  { key: 'ctr', label: 'CTR', sortable: true, format: 'percent' as const },
  { key: 'position', label: 'Avg Position', sortable: true, format: 'number' as const },
];

const PAGE_COLUMNS = [
  { key: 'page', label: 'Page', sortable: true, format: 'text' as const },
  { key: 'clicks', label: 'Clicks', sortable: true, format: 'number' as const },
  { key: 'impressions', label: 'Impressions', sortable: true, format: 'number' as const },
  { key: 'ctr', label: 'CTR', sortable: true, format: 'percent' as const },
  { key: 'position', label: 'Avg Position', sortable: true, format: 'number' as const },
];

const SEOOrganic: React.FC<SEOOrganicProps> = ({ gsc }) => {
  return (
    <div>
      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--4">
          <ScoreCard title="Organic Clicks" value={gsc.summary.clicks} previousValue={2100} format="number" />
          <ScoreCard title="Impressions" value={gsc.summary.impressions} previousValue={39000} format="number" />
          <ScoreCard title="Click-Through Rate" value={gsc.summary.ctr} previousValue={4.8} format="percent" />
          <ScoreCard title="Avg Position" value={gsc.summary.avgPosition} previousValue={16.1} format="number" />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card">
          <div className="analytics__chart-card-title">Organic Clicks &amp; Impressions (30 days)</div>
          <TrendChart
            data={gsc.trend}
            lines={[
              { key: 'clicks', color: '#00FFFF', name: 'Clicks' },
              { key: 'impressions', color: 'rgba(255,255,255,0.25)', name: 'Impressions (÷10)' },
            ]}
            height={220}
          />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card-title" style={{ marginBottom: 12 }}>Top Search Queries</div>
        <DataTable
          columns={QUERY_COLUMNS}
          data={gsc.queries as unknown as Record<string, unknown>[]}
          searchable
          pageSize={10}
          rowClassName={(row) => {
            const pos = Number(row.position);
            if (pos <= 5) return '';
            if (pos <= 10) return '';
            return '';
          }}
        />
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card-title" style={{ marginBottom: 12 }}>Top Pages by Organic Traffic</div>
        <DataTable
          columns={PAGE_COLUMNS}
          data={gsc.pages as unknown as Record<string, unknown>[]}
          searchable
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default SEOOrganic;
