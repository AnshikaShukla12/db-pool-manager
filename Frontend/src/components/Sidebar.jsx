import { NavLink } from 'react-router-dom';
import { usePool } from '../context/PoolContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Metrics', path: '/metrics' },
  { label: 'Logs', path: '/logs' },
  { label: 'Settings', path: '/settings', restricted: true },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { poolStatus, role } = usePool();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-full transform bg-white/95 p-4 shadow-xl transition duration-300 dark:bg-slate-950 lg:static lg:translate-x-0 lg:w-72 lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between lg:hidden">
        <p className="text-base font-semibold text-slate-900 dark:text-white">Menu</p>
        <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
          Close
        </button>
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Navigation</p>
          <nav className="mt-4 space-y-2">
            {navItems.map((item) => {
              const disabled = item.restricted && role !== 'admin';
              return disabled ? (
                <div key={item.path} className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
                  {item.label} (Viewer)
                </div>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-950'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Pool status</p>
          <div className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex justify-between">
              <span>Status</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                {poolStatus?.status || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Max pool</span>
              <span>{poolStatus?.maxPoolSize ?? '--'}</span>
            </div>
            <div className="flex justify-between">
              <span>Min pool</span>
              <span>{poolStatus?.minPoolSize ?? '--'}</span>
            </div>
            <div className="flex justify-between">
              <span>Timeout ms</span>
              <span>{poolStatus?.waitQueueTimeoutMS ?? '--'}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
