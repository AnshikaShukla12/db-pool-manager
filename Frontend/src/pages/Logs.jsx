import { useEffect, useState } from 'react';
import { usePool } from '../context/PoolContext';
import Loader from '../components/Loader';

const Logs = () => {
  const { logs, getServerLogs, loading } = usePool();
  const [localLogs, setLocalLogs] = useState(logs);

  useEffect(() => {
    async function load() {
      const serverLogs = await getServerLogs();
      setLocalLogs(serverLogs);
    }
    load();
  }, [getServerLogs]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Audit Logs</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Configuration and pool events</h1>
      </div>

      {loading ? (
        <Loader label="Loading audit logs..." />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {localLogs.length ? (
                localLogs.map((log) => (
                  <tr key={log.timestamp} className="hover:bg-slate-50 dark:hover:bg-slate-900/80">
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-200">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-4 text-slate-900 font-semibold dark:text-white">{log.action}</td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">
                      <pre className="whitespace-pre-wrap text-xs leading-5">Old: {JSON.stringify(log.oldValue)}
New: {JSON.stringify(log.newValue)}</pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No logs available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Logs;
