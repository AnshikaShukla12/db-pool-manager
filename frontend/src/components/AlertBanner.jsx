import PropTypes from 'prop-types';

const AlertBanner = ({ alerts }) => {
  if (!alerts?.length) return null;

  return (
    <div className="space-y-3 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-sm dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
      <p className="font-semibold">Active alerts</p>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 rounded-2xl bg-white/80 p-3 text-left shadow-sm dark:bg-slate-900/90">
            <span className="mt-1 text-xl">{alert.level === 'critical' ? '🚨' : '⚠️'}</span>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{alert.title}</p>
              <p className="text-slate-600 dark:text-slate-300">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AlertBanner.propTypes = {
  alerts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      message: PropTypes.string,
      level: PropTypes.oneOf(['normal', 'warning', 'critical']),
    })
  ),
};

export default AlertBanner;
