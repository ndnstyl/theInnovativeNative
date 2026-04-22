import React from 'react';
import ScoreCard from '../ScoreCard';
import FunnelChart from '../FunnelChart';
import BarChartComponent from '../BarChartComponent';
import DonutChart from '../DonutChart';
import DataTable from '../DataTable';

interface ConversionFunnelProps {
  funnel: {
    stages: Array<{ name: string; count: number; rate: number }>;
  };
  pipeline: {
    summary: { totalLeads: number; hotLeads: number; meetingsBooked: number; dealsWon: number; conversionRate: number };
    byStage: Array<{ stage: string; count: number }>;
    bySource: Array<{ source: string; count: number }>;
    recentLeads: Array<{ name: string; company: string; source: string; stage: string; heat: string; date: string }>;
    byHeat: { cold: number; warm: number; hot: number };
  };
}

const LEAD_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true, format: 'text' as const },
  { key: 'company', label: 'Company', sortable: true, format: 'text' as const },
  { key: 'source', label: 'Source', sortable: true, format: 'text' as const },
  { key: 'stage', label: 'Stage', sortable: true, format: 'text' as const },
  { key: 'heat', label: 'Heat', sortable: true, format: 'text' as const },
  { key: 'date', label: 'Date', sortable: true, format: 'text' as const },
];

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ funnel, pipeline }) => {
  const stageData = pipeline.byStage.map((s) => ({ name: s.stage, value: s.count }));
  const heatData = [
    { name: 'Cold', value: pipeline.byHeat.cold },
    { name: 'Warm', value: pipeline.byHeat.warm },
    { name: 'Hot', value: pipeline.byHeat.hot },
  ];

  return (
    <div>
      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--5">
          <ScoreCard title="Total Leads" value={pipeline.summary.totalLeads} previousValue={128} format="number" />
          <ScoreCard title="Hot Leads" value={pipeline.summary.hotLeads} previousValue={9} format="number" />
          <ScoreCard title="Meetings Booked" value={pipeline.summary.meetingsBooked} previousValue={6} format="number" />
          <ScoreCard title="Deals Won" value={pipeline.summary.dealsWon} previousValue={1} format="number" />
          <ScoreCard title="Conv. Rate" value={pipeline.summary.conversionRate} previousValue={0.9} format="percent" />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card">
          <div className="analytics__chart-card-title">Full Conversion Funnel</div>
          <FunnelChart stages={funnel.stages} />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--2">
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Leads by Pipeline Stage</div>
            <BarChartComponent
              data={stageData}
              color="#00FFFF"
              height={260}
              horizontal
            />
          </div>
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Leads by Heat Level</div>
            <DonutChart
              data={heatData}
              colors={['#54a0ff', '#ff9f43', '#ff6b6b']}
              height={260}
            />
          </div>
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card-title" style={{ marginBottom: 12 }}>Recent Leads</div>
        <DataTable
          columns={LEAD_COLUMNS}
          data={pipeline.recentLeads as unknown as Record<string, unknown>[]}
          pageSize={10}
          rowClassName={(row) => {
            if (row.heat === 'hot') return 'analytics__row--hot';
            return '';
          }}
        />
      </div>
    </div>
  );
};

export default ConversionFunnel;
