import { memo } from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PropTypes from 'prop-types';

const PoolChart = ({ title, description, data, dataKeys, barKey }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #CBD5E1', backgroundColor: '#ffffff' }} />
          <Legend verticalAlign="top" height={36} />
          <Area type="monotone" dataKey={dataKeys[0]} stroke="#2563eb" fillOpacity={0.15} fill="#3b82f6" />
          {dataKeys[1] && <Line type="monotone" dataKey={dataKeys[1]} stroke="#14b8a6" strokeWidth={2} />}
          {barKey && <Bar dataKey={barKey} fill="#f97316" barSize={18} radius={[8, 8, 0, 0]} />}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </section>
);

PoolChart.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  barKey: PropTypes.string,
};

PoolChart.defaultProps = {
  barKey: null,
};

export default memo(PoolChart);
