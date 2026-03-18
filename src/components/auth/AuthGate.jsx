import { useAuth } from '../../context/AuthContext';
import LoginPage from './LoginPage';

export default function AuthGate({ children }) {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'var(--bg-primary)', zIndex: 9999
      }} />
    );
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return children;
}
