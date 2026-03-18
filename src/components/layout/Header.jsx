import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useUI } from '../../context/UIContext';
import UserMenu from './UserMenu';

export default function Header({ syncStatus }) {
  const { currentUser } = useAuth();
  const { headerInfo } = useAppData();
  const { setEditHeaderOpen } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);

  const profileSrc = currentUser?.photoURL ||
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%239B8E7E'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-family='Arial'%3E${encodeURIComponent((currentUser?.displayName || 'U').charAt(0).toUpperCase())}%3C/text%3E%3C/svg%3E`;

  return (
    <div className="header" id="headerContainer">
      <div className="header-label sans" onClick={() => setEditHeaderOpen(true)} style={{ cursor: 'pointer' }}>
        X-Train
      </div>
      <div className="header-title" onClick={() => setEditHeaderOpen(true)} style={{ cursor: 'pointer' }}>
        {headerInfo.name}
      </div>
      <div className="header-sub sans" onClick={() => setEditHeaderOpen(true)} style={{ cursor: 'pointer' }}>
        {headerInfo.subtitle}
      </div>
      <div className="auth-container">
        {currentUser && (
          <div className="user-profile" onClick={() => setMenuOpen(o => !o)}>
            <img src={profileSrc} alt="Profile" />
            {menuOpen && <UserMenu onClose={() => setMenuOpen(false)} />}
          </div>
        )}
      </div>
      <div
        className="sync-status sans"
        style={{ opacity: syncStatus ? 1 : 0 }}
      >
        {syncStatus}
      </div>
    </div>
  );
}
