export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value ?? 0);
};

export const formatPercent = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0%';
  return `${Math.round(value)}%`;
};

export const formatTime = (timestamp) => {
  if (!timestamp) return '--';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
