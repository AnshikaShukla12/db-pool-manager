const Loader = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
    <div className="flex items-center gap-3">
      <div className="loader h-8 w-8 rounded-full border-4 border-slate-300"></div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  </div>
);

export default Loader;
