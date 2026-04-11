import { useEffect, useState } from 'react';
import { usePool } from '../context/PoolContext';
import Loader from '../components/Loader';

const Settings = () => {
  const { config, poolStatus, loading, updateConfig, error } = usePool();
  const [formState, setFormState] = useState(config);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormState(config);
  }, [config]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: Number(value) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateConfig(formState);
      setMessage('Pool configuration updated successfully.');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">Pool Configuration</h1>
      </div>

      {loading ? (
        <Loader label="Syncing configuration..." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Max Pool Size</label>
              <input
                name="maxPoolSize"
                type="number"
                min="1"
                value={formState.maxPoolSize}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Min Pool Size</label>
              <input
                name="minPoolSize"
                type="number"
                min="0"
                value={formState.minPoolSize}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Wait Queue Timeout (ms)</label>
              <input
                name="waitQueueTimeoutMS"
                type="number"
                min="50"
                value={formState.waitQueueTimeoutMS}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-sky-400"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Update Configuration'}
            </button>

            {message ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
            ) : null}
          </form>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Current Pool Status</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex justify-between rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                <span>Max Pool Size</span>
                <span>{poolStatus?.maxPoolSize ?? '--'}</span>
              </div>
              <div className="flex justify-between rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                <span>Min Pool Size</span>
                <span>{poolStatus?.minPoolSize ?? '--'}</span>
              </div>
              <div className="flex justify-between rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                <span>Connection State</span>
                <span>{poolStatus?.status ?? 'Unknown'}</span>
              </div>
            </div>
            {error ? (
              <p className="mt-5 text-sm text-red-600 dark:text-red-300">{error}</p>
            ) : null}
          </aside>
        </div>
      )}
    </div>
  );
};

export default Settings;
