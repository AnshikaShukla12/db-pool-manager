export const healthScore = ({ saturation, waitingRequests, errorCount }) => {
  const score = Math.max(0, Math.min(100, 100 - saturation - waitingRequests * 2 - (errorCount ? 10 : 0)));
  if (score >= 80) return { label: 'Healthy', color: 'emerald', value: score };
  if (score >= 55) return { label: 'Moderate', color: 'amber', value: score };
  return { label: 'Critical', color: 'rose', value: score };
};

export const getPrediction = (metrics) => {
  const samples = metrics.slice(0, 6).reverse();
  if (samples.length < 3) {
    return { label: 'Stable', trend: 0 };
  }

  const deltas = [];
  for (let i = 1; i < samples.length; i += 1) {
    deltas.push(samples[i].activeConnections - samples[i - 1].activeConnections);
  }

  const slope = deltas.reduce((sum, value) => sum + value, 0) / deltas.length;
  if (slope > 2) return { label: 'Increasing', trend: slope };
  if (slope < -2) return { label: 'Decreasing', trend: slope };
  return { label: 'Stable', trend: slope };
};

export const buildHeatmap = (metrics, segments = 12) => {
  const buckets = Array.from({ length: segments }, () => ({ count: 0, total: 0 }));
  metrics.forEach((record, index) => {
    const bucketIndex = Math.floor((index / metrics.length) * segments);
    const value = Math.max(0, record.activeConnections + record.waitingRequests);
    buckets[bucketIndex].count += 1;
    buckets[bucketIndex].total += value;
  });
  return buckets.map((bucket, index) => ({
    label: `T-${segments - index}`,
    value: bucket.count ? Math.round(bucket.total / bucket.count) : 0,
  }));
};

export const buildAverages = (metrics) => {
  const averageActive = Math.round(
    metrics.reduce((sum, item) => sum + item.activeConnections, 0) / Math.max(metrics.length, 1)
  );
  const averageIdle = Math.round(
    metrics.reduce((sum, item) => sum + item.idleConnections, 0) / Math.max(metrics.length, 1)
  );
  return { averageActive, averageIdle };
};
