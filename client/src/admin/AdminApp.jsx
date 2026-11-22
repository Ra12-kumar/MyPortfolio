import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import { AdminLayout } from './AdminLayout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Inquiries from './pages/Inquiries';
import ContentManager from './pages/ContentManager';
import { resourceConfigs } from './resourceConfigs';

function RequireAuth({ children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function AdminApp() {
  // Keep the admin area out of search engines.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Admin — RJK Portfolio';
    return () => {
      meta.remove();
      document.title = prevTitle;
    };
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Overview />} />
          <Route path="inquiries" element={<Inquiries />} />
          {Object.entries(resourceConfigs).map(([key, cfg]) => (
            <Route key={key} path={key} element={<ContentManager key={key} resource={key} config={cfg} />} />
          ))}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
