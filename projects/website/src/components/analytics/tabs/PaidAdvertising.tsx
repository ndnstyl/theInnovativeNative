import React from 'react';
import ScoreCard from '../ScoreCard';
import TrendChart from '../TrendChart';
import DataTable from '../DataTable';
import BarChartComponent from '../BarChartComponent';

interface PaidAdvertisingProps {
  meta: {
    summary: { spend: number; impressions: number; clicks: number; ctr: number; cpc: number; cpm: number; leads: number; costPerLead: number };
    trend: Array<{ date: string; spend: number; clicks: number; leads: number }>;
    campaigns: Array<{ name: string; status: string; spend: number; impressions: number; clicks: number; ctr: number; cpc: number; leads: number; costPerLead: number }>;
    demographics: {
      age: Array<{ range: string; spend: number; clicks: number }>;
      gender: Array<{ gender: string; spend: number; clicks: number }>;
      platform: Array<{ platform: string; spend: number; clicks: number }>;
    };
  };
}

const CAMPAIGN_COLUMNS = [
  { key: 'name', label: 'Campaign', sortable: true, format: 'text' as const },
  { key: 'status', label: 'Status', sortable: true, format: 'text' as const },
  { key: 'spend', label: 'Spend', sortable: true, format: 'currency' as const },
  { key: 'clicks', label: 'Clicks', sortable: true, format: 'number' as const },
  { key: 'ctr', label: 'CTR', sortable: true, format: 'percent' as const },
  { key: 'leads', label: 'Leads', sortable: true, format: 'number' as const },
  { key: 'costPerLead', label: 'CPL', sortable: true, format: 'currency' as const },
];

const PaidAdvertising: React.FC<PaidAdvertisingProps> = ({ meta }) => {
  const ageData = meta.demographics.age.map((d) => ({ name: d.range, value: d.clicks }));
  const genderData = meta.demographics.gender.map((d) => ({ name: d.gender, value: d.clicks }));
  const platformData = meta.demographics.platform.map((d) => ({ name: d.platform, value: d.clicks }));

  return (
    <div>
      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--6">
          <ScoreCard title="Total Spend" value={meta.summary.spend} previousValue={980} format="currency" />
          <ScoreCard title="Impressions" value={meta.summary.impressions} previousValue={72000} format="number" />
          <ScoreCard title="Clicks" value={meta.summary.clicks} previousValue={1840} format="number" />
          <ScoreCard title="CTR" value={meta.summary.ctr} previousValue={2.31} format="percent" />
          <ScoreCard title="CPC" value={meta.summary.cpc} previousValue={0.67} format="currency" />
          <ScoreCard title="Cost per Lead" value={meta.summary.costPerLead} previousValue={42.1} format="currency" />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card">
          <div className="analytics__chart-card-title">Spend &amp; Leads Over Time</div>
          <TrendChart
            data={meta.trend}
            lines={[
              { key: 'spend', color: '#ff6b6b', name: 'Spend ($)' },
              { key: 'leads', color: '#22c55e', name: 'Leads' },
            ]}
            height={220}
          />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card-title" style={{ marginBottom: 12 }}>Campaigns</div>
        <DataTable
          columns={CAMPAIGN_COLUMNS}
          data={meta.campaigns as unknown as Record<string, unknown>[]}
          pageSize={10}
          rowClassName={(row) => (row.status === 'paused' ? 'opacity-50' : '')}
        />
      </div>

      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--3">
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Clicks by Age</div>
            <BarChartComponent data={ageData} color="#00FFFF" height={200} />
          </div>
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Clicks by Gender</div>
            <BarChartComponent data={genderData} color="#ff9f43" height={200} />
          </div>
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Clicks by Platform</div>
            <BarChartComponent data={platformData} color="#54a0ff" height={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidAdvertising;
