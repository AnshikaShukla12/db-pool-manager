import { useMemo } from 'react';
import { usePool } from '../context/PoolContext';
import StatCard from '../components/StatCard';
import PoolChart from '../components/PoolChart';
import Loader from '../components/Loader';
import SuggestionsPanel from '../components/SuggestionsPanel';
import { formatTime } from '../utils/formatters';
import { getPrediction } from '../utils/analytics';

const Dashboard = () => {
  const { metrics, poolStatus, loading, error, latestMetric, systemHealth } = usePool();
  const prediction = useMemo(() => getPrediction(metrics), [metrics]);

  const chartData = useMemo(
    () =>
      metrics
        .slice()
        .reverse()
        .map((item) => ({
          name: formatTime(item.timestamp),
          active: item.activeConnections,
          idle: item.idleConnections,
          waiting: item.waitingRequests,
          saturation: poolStatus?.maxPoolSize
            ? Math.round((item.activeConnections / poolStatus.maxPoolSize) * 100)
            : 0,
        })),
    [metrics, poolStatus]
  );

  const activeConnections = latestMetric?.activeConnections ?? 0;
  const idleConnections = latestMetric?.idleConnections ?? 0;
  const waitingRequests = latestMetric?.waitingRequests ?? 0;
  const saturation = poolStatus?.maxPoolSize
    ? Math.round((activeConnections / poolStatus.maxPoolSize) * 100)
    : 0;

  const suggestions = useMemo(() => {
    const items = [];

    if (saturation > 85) {
      items.push({
        id: 'scale-up',
        title: 'Increase maxPoolSize',
        description: 'Pool saturation is high. Raising max pool size can prevent connection contention.',
      });
    }

    if (idleConnections > activeConnections && idleConnections > (poolStatus?.maxPoolSize || 0) * 0.4) {
      items.push({
        id: 'scale-down',
        title: 'Reduce maxPoolSize',
        description: 'A large number of idle connections may indicate the pool is oversized for current load.',
      });
    }

    if (waitingRequests > Math.max(5, Math.round((poolStatus?.maxPoolSize || 10) * 0.12))) {
      items.push({
        id: 'queue-tune',
        title: 'Review waitQueueTimeoutMS',
        description: 'Queue latency is increasing. Consider reducing wait timeout or scaling pool capacity.',
      });
    }

    return items;
  }, [activeConnections, idleConnections, poolStatus?.maxPoolSize, saturation, waitingRequests]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Connection Pool Dashboard</h1>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-slate-500 dark:text-slate-400">Prediction</p>
          <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{prediction.label}</p>
          <p className="text-slate-600 dark:text-slate-300">Trend slope: {prediction.trend.toFixed(1)}</p>
        </div>
      </div>

      {loading && !metrics.length ? (
        <Loader label="Fetching connection statistics..." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Active Connections" value={activeConnections} subtitle="Live" accent="bg-sky-100 text-sky-700" />
            <StatCard title="Idle Connections" value={idleConnections} subtitle="Available" accent="bg-emerald-100 text-emerald-700" />
            <StatCard title="Waiting Requests" value={waitingRequests} subtitle="Pending" accent="bg-amber-100 text-amber-700" />
            <StatCard title="Pool Saturation" value={`${saturation}%`} subtitle="Health" accent={saturation > 80 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-800'} />
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
              Unable to refresh metrics: {error}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <PoolChart
              title="Connection Usage Over Time"
              description="Track active and idle connection trends across the pool."
              data={chartData}
              dataKeys={['active', 'idle']}
              barKey="waiting"
            />
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">System health</p>
                <p className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">{systemHealth.value}%</p>
                <p className={`mt-2 text-sm font-medium text-${systemHealth.color}-700 dark:text-${systemHealth.color}-200`}>{systemHealth.label}</p>
              </div>
              <SuggestionsPanel suggestions={suggestions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
