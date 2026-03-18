import { useEffect, useRef } from 'react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';

export default function UserMenu({ onClose }) {
  const { currentUser, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { getCloudSnapshot } = useAppData();
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          !e.target.closest('.user-profile')) {
        onClose();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  const handleSignOut = async () => {
    onClose();
    await signOut(async () => {
      // Save to cloud before sign out - handled by saveToCloud in sync hook
      // The getCloudSnapshot is available if needed but signOut handles reload
    });
  };

  return (
    <div className="user-menu sans active" ref={menuRef}>
      <div className="user-menu-item user-menu-name">
        {currentUser?.displayName || currentUser?.email || 'User'}
      </div>
      <div className="dark-mode-toggle">
        <div className="dark-mode-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
          <span>Dark Mode</span>
        </div>
        <div className={`toggle-switch ${darkMode ? 'active' : ''}`} onClick={toggleDarkMode}>
          <div className="toggle-slider" />
        </div>
      </div>
      <button className="user-menu-item" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
