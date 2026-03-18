import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LogoSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="52" height="52">
    <rect width="100" height="100" rx="18" fill="#FFFFFF"/>
    <g transform="rotate(45,50,50)" fill="#111111">
      <rect x="46" y="18" width="8" height="64" rx="2"/>
      <rect x="38" y="18" width="24" height="10" rx="3"/>
      <rect x="38" y="72" width="24" height="10" rx="3"/>
      <rect x="35" y="21" width="10" height="7" rx="2"/>
      <rect x="55" y="21" width="10" height="7" rx="2"/>
      <rect x="35" y="72" width="10" height="7" rx="2"/>
      <rect x="55" y="72" width="10" height="7" rx="2"/>
    </g>
    <g transform="rotate(-45,50,50)" fill="#111111">
      <rect x="46" y="18" width="8" height="64" rx="2"/>
      <rect x="38" y="18" width="24" height="10" rx="3"/>
      <rect x="38" y="72" width="24" height="10" rx="3"/>
      <rect x="35" y="21" width="10" height="7" rx="2"/>
      <rect x="55" y="21" width="10" height="7" rx="2"/>
      <rect x="35" y="72" width="10" height="7" rx="2"/>
      <rect x="55" y="72" width="10" height="7" rx="2"/>
    </g>
  </svg>
);

const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function LoginPage() {
  const { signInWithEmail, signUpWithEmail, resetPassword, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => { setError(''); setSuccessMsg(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    if (mode === 'signin') {
      const { error: err } = await signInWithEmail(email, password);
      if (err) setError(err);
    } else {
      const { error: err } = await signUpWithEmail(email, password);
      if (err) setError(err);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    clearMessages();
    if (!email) { setError('Enter your email address above, then click "Forgot password?".'); return; }
    const { error: err } = await resetPassword(email);
    if (err) setError(err);
    else setSuccessMsg('Password reset email sent — check your inbox.');
  };

  const handleGoogle = async () => {
    clearMessages();
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5000, background: 'var(--bg-primary)', overflowY: 'auto' }}>
      <div className="login-inner sans">
        <div className="login-logo"><LogoSVG /></div>
        <div className="login-title">X-Train</div>
        <div className="login-subtitle">{mode === 'signin' ? 'Sign in to continue' : 'Create your account'}</div>

        {error && <div className="login-error">{error}</div>}
        {successMsg && <div className="login-success">{successMsg}</div>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="login-form-group">
            <input
              type="email" className="login-input" placeholder="Email address"
              autoComplete="email" value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="login-form-group">
            <div className="login-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'} className="login-input"
                placeholder="Password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                value={password} onChange={e => setPassword(e.target.value)}
              />
              <button type="button" className="login-pw-toggle" onClick={() => setShowPassword(p => !p)} aria-label="Toggle password">
                <EyeIcon open={!showPassword} />
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn-primary" disabled={loading}>
            {loading ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        {mode === 'signin' && (
          <button className="login-text-link" onClick={handleForgotPassword}>Forgot password?</button>
        )}

        <div className="login-divider"><span>or</span></div>

        <button className="login-btn-google" onClick={handleGoogle}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 10, flexShrink: 0 }}>
            <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-toggle-area">
          <span className="login-toggle-text">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button className="login-text-link-inline" onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); clearMessages(); }}>
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
