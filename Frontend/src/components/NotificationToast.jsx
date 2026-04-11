import { useEffect } from 'react';
import PropTypes from 'prop-types';

const NotificationToast = ({ notifications, onDismiss }) => {
  useEffect(() => {
    if (!notifications.length) return;
    const timer = setTimeout(() => {
      onDismiss(notifications[0].id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [notifications, onDismiss]);

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col gap-3">
      {notifications.map((toast) => (
        <div
          key={toast.id}
          className="max-w-xs rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">{toast.title}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

NotificationToast.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      message: PropTypes.string,
      level: PropTypes.oneOf(['normal', 'warning', 'critical']),
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default NotificationToast;
