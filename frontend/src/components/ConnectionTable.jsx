import { formatTime } from '../utils/formatters';

const ConnectionTable = ({ metrics }) => {
  const sortedMetrics = [...metrics].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Timestamp</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Idle</th>
            <th className="px-4 py-3">Waiting</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {sortedMetrics.length > 0 ? (
            sortedMetrics.map((metric) => (
              <tr key={metric.timestamp} className="hover:bg-slate-50 dark:hover:bg-slate-900/80">
                <td className="px-4 py-4 text-slate-700 dark:text-slate-100">{formatTime(metric.timestamp)}</td>
                <td className="px-4 py-4 text-slate-900 font-semibold dark:text-white">{metric.activeConnections}</td>
                <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{metric.idleConnections}</td>
                <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{metric.waitingRequests}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                No metrics available yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ConnectionTable;
