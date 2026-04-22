import React, { useState } from 'react';
import Head from 'next/head';
import mockData from '@/data/analytics-mock.json';
import DateRangePicker from '@/components/analytics/DateRangePicker';
import ExecutiveSummary from '@/components/analytics/tabs/ExecutiveSummary';
import TrafficBehavior from '@/components/analytics/tabs/TrafficBehavior';
import SEOOrganic from '@/components/analytics/tabs/SEOOrganic';
import PaidAdvertising from '@/components/analytics/tabs/PaidAdvertising';
import LinkIntelligence from '@/components/analytics/tabs/LinkIntelligence';
import ConversionFunnel from '@/components/analytics/tabs/ConversionFunnel';
import ABTesting from '@/components/analytics/tabs/ABTesting';

type TabId = 'summary' | 'traffic' | 'seo' | 'paid' | 'links' | 'funnel' | 'ab';

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'summary', label: 'Executive Summary' },
  { id: 'traffic', label: 'Traffic & Behavior' },
  { id: 'seo', label: 'SEO & Organic' },
  { id: 'paid', label: 'Paid Advertising' },
  { id: 'links', label: 'Link Intelligence' },
  { id: 'funnel', label: 'Conversion Funnel' },
  { id: 'ab', label: 'A/B Testing' },
];

const HASH = 'e6cecee4dbea2e91ee5f56c1714e3bf7ab43f4e73f846a71866aa6e722946628';
const SALT = 'tin-command';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [dateRange, setDateRange] = useState('last30');
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  async function handlePwSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hash = await sha256(`${SALT}:${pw}`);
    if (hash === HASH) {
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Incorrect password.');
    }
  }

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  if (!authed) {
    return (
      <>
        <Head>
          <title>Command Center | TIN</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="analytics__password-gate">
          <div className="analytics__password-gate-card">
            <h2>Command Center</h2>
            <p>Enter your access code to continue.</p>
            <form onSubmit={handlePwSubmit}>
              <input
                type="password"
                placeholder="Access code"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoFocus
              />
              <button type="submit">Unlock</button>
              {pwError && <div className="error">{pwError}</div>}
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Command Center | TIN</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="analytics" key={refreshKey}>
        <div className="analytics__inner">
          <div className="analytics__header">
            <h1>
              TIN <span>Command Center</span>
            </h1>
            <div className="analytics__header-controls">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <button className="analytics__refresh-btn" onClick={handleRefresh} type="button" aria-label="Refresh data">
                ↻ Refresh
              </button>
            </div>
          </div>

          <div className="analytics__tabs" role="tablist" aria-label="Analytics sections">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`analytics__tab${activeTab === tab.id ? ' analytics__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                tabIndex={activeTab === tab.id ? 0 : -1}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'summary' && (
            <ExecutiveSummary
              ga4={mockData.ga4}
              meta={mockData.meta}
              gsc={mockData.gsc}
              sink={mockData.sink}
            />
          )}
          {activeTab === 'traffic' && (
            <TrafficBehavior ga4={mockData.ga4} />
          )}
          {activeTab === 'seo' && (
            <SEOOrganic gsc={mockData.gsc} />
          )}
          {activeTab === 'paid' && (
            <PaidAdvertising meta={mockData.meta} />
          )}
          {activeTab === 'links' && (
            <LinkIntelligence sink={mockData.sink} />
          )}
          {activeTab === 'funnel' && (
            <ConversionFunnel funnel={mockData.funnel} pipeline={mockData.pipeline} />
          )}
          {activeTab === 'ab' && (
            <ABTesting abTests={mockData.abTests} />
          )}
        </div>
      </div>
    </>
  );
}
