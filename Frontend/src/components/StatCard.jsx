import PropTypes from 'prop-types';
import { memo } from 'react';

const StatCard = ({ title, value, subtitle, accent = 'bg-slate-100 text-slate-800' }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition dark:border-slate-800 dark:bg-slate-950">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
      </div>
      <div className={`rounded-2xl px-3 py-2 text-xs font-semibold ${accent}`}>{subtitle}</div>
    </div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  accent: PropTypes.string,
};

StatCard.defaultProps = {
  subtitle: '',
  accent: 'bg-slate-100 text-slate-800',
};

export default memo(StatCard);
