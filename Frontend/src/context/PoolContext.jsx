import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import useMetrics from '../hooks/useMetrics';
import { healthScore } from '../utils/analytics';

const PoolContext = createContext(null);
export function usePool() {
  return useContext(PoolContext);
}

const storageDarkKey = 'db-pool-dark';
const storageRoleKey = 'db-pool-role';
const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PoolProvider = ({ children }) => {
  const [metrics, setMetrics] = useState([]);
  const [poolStatus, setPoolStatus] = useState(null);
  const [config, setConfig] = useState({ maxPoolSize: 10, minPoolSize: 2, waitQueueTimeoutMS: 1000 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem(storageDarkKey) === 'true');
  const [role, setRole] = useState(() => window.localStorage.getItem(storageRoleKey) || 'admin');
  const [socketConnected, setSocketConnected] = useState(false);
  const [usePolling, setUsePolling] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [logs, setLogs] = useState([]);

  useMetrics({
    setMetrics,
    setPoolStatus,
    setConfig,
    setLoading,
    setError,
    enabled: usePolling,
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    window.localStorage.setItem(storageDarkKey, darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    window.localStorage.setItem(storageRoleKey, role);
  }, [role]);

  const addLog = useCallback((action, oldValue, newValue) => {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      oldValue,
      newValue,
    };
    setLogs((current) => [entry, ...current].slice(0, 200));
    return entry;
  }, []);

  const pushNotification = useCallback((title, message, level = 'normal') => {
    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      title,
      message,
      level,
    };
    setNotifications((current) => [entry, ...current].slice(0, 5));
  }, []);

  const pushAlert = useCallback((title, message, level = 'warning') => {
    setAlerts((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        title,
        message,
        level,
      },
      ...current.slice(0, 4),
    ]);
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const getServerLogs = useCallback(async () => {
    try {
      const response = await api.getLogs();
      setLogs(response.data);
      return response.data;
    } catch {
      return logs;
    }
  }, [logs]);

  const checkAlertConditions = useCallback(
    (snapshot) => {
      if (!snapshot || !config.maxPoolSize) return;

      const saturation = Math.round((snapshot.activeConnections / config.maxPoolSize) * 100);
      if (saturation >= 90) {
        pushAlert('Critical saturation', `Pool saturation is at ${saturation}%. Immediate scaling recommended.`, 'critical');
        pushNotification('Critical saturation', `Pool saturation is at ${saturation}%`, 'critical');
      } else if (saturation >= 80) {
        pushAlert('High saturation', `Pool saturation is at ${saturation}%.`, 'warning');
      }

      if (snapshot.waitingRequests >= Math.max(5, Math.round(config.maxPoolSize * 0.15))) {
        pushAlert('Queue pressure detected', `${snapshot.waitingRequests} requests are waiting.`, 'warning');
        pushNotification('Queue pressure', `${snapshot.waitingRequests} waiting requests detected.`, 'warning');
      }
    },
    [config.maxPoolSize, pushAlert, pushNotification]
  );

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ['websocket'],
      reconnectionAttempts: 3,
    });

    socket.on('connect', () => {
      setSocketConnected(true);
      setUsePolling(false);
      pushNotification('Live updates active', 'WebSocket connection established.', 'normal');
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
      setUsePolling(true);
      pushNotification('Live updates paused', 'WebSocket disconnected; falling back to polling.', 'warning');
    });

    socket.on('metrics:update', (payload) => {
      setMetrics((current) => [payload, ...current].slice(0, 200));
      setLoading(false);
      checkAlertConditions(payload);
    });

    socket.on('pool:update', (payload) => {
      setPoolStatus(payload);
      setConfig((current) => ({
        ...current,
        maxPoolSize: payload.maxPoolSize ?? current.maxPoolSize,
        minPoolSize: payload.minPoolSize ?? current.minPoolSize,
        waitQueueTimeoutMS: payload.waitQueueTimeoutMS ?? current.waitQueueTimeoutMS,
      }));
    });

    socket.on('logs:update', (entry) => {
      setLogs((current) => [entry, ...current].slice(0, 200));
    });

    socket.on('connect_error', () => {
      setError('WebSocket connection failed, using polling fallback.');
      setUsePolling(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [checkAlertConditions, pushNotification]);

  const updateConfig = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const response = await api.updateConfig(payload);
        setConfig((current) => ({ ...current, ...response.data }));
        setPoolStatus((current) => ({ ...current, ...response.data }));
        addLog('Pool configuration updated', config, response.data);
        pushNotification('Configuration saved', 'Pool settings have been updated successfully.', 'normal');
        return response.data;
      } catch (err) {
        const message = err?.response?.data?.message || err.message || 'Failed to update pool configuration.';
        setError(message);
        pushAlert('Configuration failed', message, 'critical');
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [addLog, config, pushAlert]
  );

  const latestMetric = metrics[0] || {};
  const systemHealth = useMemo(
    () => healthScore({
      saturation: poolStatus?.maxPoolSize ? Math.round((latestMetric.activeConnections / poolStatus.maxPoolSize) * 100) : 0,
      waitingRequests: latestMetric.waitingRequests || 0,
      errorCount: error ? 1 : 0,
    }),
    [error, latestMetric.activeConnections, latestMetric.waitingRequests, poolStatus?.maxPoolSize]
  );

  const value = {
    metrics,
    poolStatus,
    config,
    loading,
    error,
    darkMode,
    role,
    socketConnected,
    alerts,
    notifications,
    logs,
    systemHealth,
    latestMetric,
    usePolling,
    isAdmin: role === 'admin',
    setRole,
    toggleDarkMode: () => setDarkMode((current) => !current),
    updateConfig,
    dismissNotification,
    getServerLogs,
  };

  return <PoolContext.Provider value={value}>{children}</PoolContext.Provider>;
};

export default PoolProvider;
