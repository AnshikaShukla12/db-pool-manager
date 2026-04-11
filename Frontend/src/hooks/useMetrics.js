import { useEffect, useRef } from 'react';
import api from '../services/api';

function useMetrics({ setMetrics, setPoolStatus, setConfig, setLoading, setError, enabled = true }) {
  const intervalRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        setError(null);
        setLoading(true);

        const [statusResponse, metricsResponse] = await Promise.allSettled([
          api.getPoolStatus(),
          api.getMetrics(),
        ]);

        if (!active) return;

        if (statusResponse.status === 'fulfilled') {
          setPoolStatus(statusResponse.value.data);
          setConfig((current) => ({
            ...current,
            maxPoolSize: statusResponse.value.data.maxPoolSize ?? current.maxPoolSize,
            minPoolSize: statusResponse.value.data.minPoolSize ?? current.minPoolSize,
            waitQueueTimeoutMS: statusResponse.value.data.waitQueueTimeoutMS ?? current.waitQueueTimeoutMS,
          }));
        }

        if (metricsResponse.status === 'fulfilled') {
          setMetrics(metricsResponse.value.data || []);
        }
      } catch (error) {
        if (!active) return;
        setError(error.message || 'Unable to fetch pool metrics.');
      } finally {
        if (active) setLoading(false);
      }
    }

    if (!enabled) {
      return () => {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      };
    }

    fetchData();
    intervalRef.current = window.setInterval(fetchData, 4500);

    return () => {
      active = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [enabled, setConfig, setError, setLoading, setMetrics, setPoolStatus]);
}

export default useMetrics;
