import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import type { UserProfile } from '../types';

export default function SuccessPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          navigate('/error');
          return null;
        }
        return res.json();
      })
      .then((data: UserProfile | null) => {
        if (data) setUser(data);
      })
      .catch(() => navigate('/error'))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    if (!loading && user) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [loading, user]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="page">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <div className="success-icon">✓</div>
        <h1>Login Successful!</h1>
        {user && (
          <div className="user-info">
            <div className="info-row">
              <span className="label">Name</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Provider</span>
              <span className="value">{user.provider}</span>
            </div>
          </div>
        )}
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
