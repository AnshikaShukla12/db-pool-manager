import PropTypes from 'prop-types';

const SuggestionsPanel = ({ suggestions }) => {
  if (!suggestions.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm text-slate-600 dark:text-slate-400">Your pool is performing normally. No optimization suggestions at this time.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Optimization Suggestions</h2>
      <div className="mt-4 space-y-4">
        {suggestions.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

SuggestionsPanel.propTypes = {
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
};

export default SuggestionsPanel;
