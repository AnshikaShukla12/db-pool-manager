import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';
import PoolProvider from './context/PoolContext';
import { usePool } from './context/PoolContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AlertBanner from './components/AlertBanner';
import NotificationToast from './components/NotificationToast';
import Loader from './components/Loader';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Metrics = lazy(() => import('./pages/Metrics'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Logs = lazy(() => import('./pages/Logs'));

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { alerts, notifications, dismissNotification } = usePool();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Navbar onOpenSidebar={() => setMobileMenuOpen(true)} />
      <div className="flex flex-col lg:flex-row">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 px-4 pb-8 pt-4 lg:px-8 xl:px-10">
          <AlertBanner alerts={alerts} />
          <Suspense fallback={<Loader label="Loading dashboard..." />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <NotificationToast notifications={notifications} onDismiss={dismissNotification} />
    </div>
  );
}

function App() {
  return (
    <PoolProvider>
      <Router>
        <AppContent />
      </Router>
    </PoolProvider>
  );
}

export default App;
