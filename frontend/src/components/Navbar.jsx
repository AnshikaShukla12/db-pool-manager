import { usePool } from '../context/PoolContext';

const Navbar = ({ onOpenSidebar }) => {
  const { darkMode, toggleDarkMode, socketConnected, role, setRole } = usePool();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 lg:hidden"
          >
            ☰
          </button>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">DB Pool Manager</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{socketConnected ? 'Live WebSocket updates active' : 'Using polling fallback'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {darkMode ? 'Dark' : 'Light'} mode
          </button>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
