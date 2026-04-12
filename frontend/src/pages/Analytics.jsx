import { useMemo, useState } from 'react';
import { usePool } from '../context/PoolContext';
import PoolChart from '../components/PoolChart';
import Loader from '../components/Loader';
import { buildHeatmap, buildAverages, getPrediction } from '../utils/analytics';

const RANGE_OPTIONS = [
  { label: 'Last 1 hour', value: '1h' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days', value: '7d' },
];

const Analytics = () => {
  const { metrics, loading, error } = usePool();
  const [range, setRange] = useState('1h');

  const filteredMetrics = useMemo(() => {
    const now = Date.now();
    const rangeMs = range === '7d' ? 7 * 24 * 60 * 60 * 1000 : range === '24h' ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    return metrics.filter((item) => Date.now() - new Date(item.timestamp).getTime() <= rangeMs).slice(0, 50);
  }, [metrics, range]);

  const averageMetrics = useMemo(() => buildAverages(filteredMetrics), [filteredMetrics]);
  const prediction = useMemo(() => getPrediction(filteredMetrics), [filteredMetrics]);
  const heatmapData = useMemo(() => buildHeatmap(filteredMetrics, 12), [filteredMetrics]);
  const chartData = useMemo(
    () => filteredMetrics.slice().reverse().map((item) => ({
      name: item.timestamp.slice(11, 16),
      active: item.activeConnections,
      waiting: item.waitingRequests,
    })),
    [filteredMetrics]
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Usage trends + predictions</h1>
      </div>

      {loading ? (
        <Loader label="Calculating analytics..." />
      ) : (
        <>
          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">Prediction</p>
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">{prediction.label} load in next 5 minutes</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRange(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    range === option.value
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <PoolChart
              title="Active vs Waiting Trend"
              description="Moving average of active connections compared with queue pressure."
              data={chartData}
              dataKeys={['active', 'waiting']}
            />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Trend summary</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Average active</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{averageMetrics.averageActive}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Average idle</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{averageMetrics.averageIdle}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Sample window</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{filteredMetrics.length} points</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Load heatmap</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {heatmapData.map((bucket) => {
                const intensity = Math.min(100, Math.max(20, Math.round(bucket.value * 2)));
                return (
                  <div key={bucket.label} className="rounded-3xl p-4 text-center" style={{ backgroundColor: `rgba(59, 130, 246, ${intensity / 160})` }}>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">{bucket.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{bucket.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
