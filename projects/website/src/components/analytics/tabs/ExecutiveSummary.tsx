import React from 'react';
import ScoreCard from '../ScoreCard';
import TrendChart from '../TrendChart';
import BarChartComponent from '../BarChartComponent';

interface ExecutiveSummaryProps {
  ga4: {
    summary: { users: number; sessions: number; newUsers: number; conversions: number };
    trend: Array<{ date: string; users: number; sessions: number }>;
    sources: Array<{ source: string; sessions: number }>;
    topPages: Array<{ path: string; views: number }>;
    events: Array<{ name: string; count: number }>;
  };
  meta: {
    summary: { spend: number; leads: number };
    trend: Array<{ date: string; spend: number; leads: number }>;
  };
  gsc: {
    queries: Array<{ query: string; clicks: number; position: number }>;
  };
  sink: {
    topLinks: Array<{ slug: string; clicks: number }>;
  };
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ ga4, meta, gsc, sink }) => {
  const roas = meta.summary.spend > 0 ? ((meta.summary.leads * 2500) / meta.summary.spend).toFixed(1) : '0';

  const sourceData = ga4.sources.map((s) => ({
    name: s.source.split(' / ')[0],
    value: s.sessions,
  }));

  const topQuery = gsc.queries.sort((a, b) => b.clicks - a.clicks)[0];
  const topPage = ga4.topPages[0];
  const topLink = sink.topLinks[0];

  return (
    <div>
      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--5">
          <ScoreCard title="Site Users" value={ga4.summary.users} previousValue={1050} format="number" />
          <ScoreCard title="Total Leads" value={meta.summary.leads} previousValue={28} format="number" />
          <ScoreCard title="Ad Spend" value={meta.summary.spend} previousValue={980} format="currency" />
          <ScoreCard title="Conversions" value={ga4.summary.conversions} previousValue={27} format="number" />
          <ScoreCard title="Est. ROAS" value={roas + 'x'} />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__grid analytics__grid--2">
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Sessions Trend (30 days)</div>
            <TrendChart
              data={ga4.trend}
              lines={[
                { key: 'sessions', color: '#00FFFF', name: 'Sessions' },
                { key: 'users', color: 'rgba(0,255,255,0.4)', name: 'Users' },
              ]}
              height={200}
            />
          </div>
          <div className="analytics__chart-card">
            <div className="analytics__chart-card-title">Spend vs Leads (30 days)</div>
            <TrendChart
              data={meta.trend}
              lines={[
                { key: 'spend', color: '#ff6b6b', name: 'Spend ($)' },
                { key: 'leads', color: '#22c55e', name: 'Leads' },
              ]}
              height={200}
            />
          </div>
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__chart-card">
          <div className="analytics__chart-card-title">Leads by Traffic Source</div>
          <BarChartComponent
            data={sourceData}
            color="#00FFFF"
            height={200}
          />
        </div>
      </div>

      <div className="analytics__section">
        <div className="analytics__quick-wins">
          <div className="analytics__quick-win">
            <div className="analytics__quick-win-label">Top Link</div>
            <div className="analytics__quick-win-value">/{topLink?.slug}</div>
            <div className="analytics__quick-win-sub">{topLink?.clicks.toLocaleString()} clicks</div>
          </div>
          <div className="analytics__quick-win">
            <div className="analytics__quick-win-label">Top Page</div>
            <div className="analytics__quick-win-value">{topPage?.path}</div>
            <div className="analytics__quick-win-sub">{topPage?.views.toLocaleString()} views</div>
          </div>
          <div className="analytics__quick-win">
            <div className="analytics__quick-win-label">Top Search Query</div>
            <div className="analytics__quick-win-value">{topQuery?.query}</div>
            <div className="analytics__quick-win-sub">{topQuery?.clicks} clicks · pos {topQuery?.position}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
