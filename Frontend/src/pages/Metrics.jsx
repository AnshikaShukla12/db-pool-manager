import { useCallback } from 'react';
import { usePool } from '../context/PoolContext';
import ConnectionTable from '../components/ConnectionTable';
import Loader from '../components/Loader';

const Metrics = () => {
  const { metrics, loading, error } = usePool();

  const downloadJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'db-pool-metrics.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [metrics]);

  const downloadCSV = useCallback(() => {
    const headers = ['Timestamp', 'Active Connections', 'Idle Connections', 'Waiting Requests'];
    const rows = metrics.map((item) => [item.timestamp, item.activeConnections, item.idleConnections, item.waitingRequests]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'db-pool-metrics.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, [metrics]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Metrics</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Detailed Connection History</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadJSON}
            className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            Download JSON
          </button>
          <button
            type="button"
            onClick={downloadCSV}
            className="rounded-3xl border border-slate-200 bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-700"
          >
            Download CSV
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading metric history..." />
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          )}
          <ConnectionTable metrics={metrics} />
        </div>
      )}
    </div>
  );
};

export default Metrics;
