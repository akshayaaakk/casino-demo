import { useEffect, useState } from 'react';
import { api } from '../api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');
  const [activeGame, setActiveGame] = useState('lobby');

  async function fetchMe() {
    if (!token) return;

    try {
      const payload = await api('/api/auth/me');
      setUser(payload.user);
      setScreen('lobby');
      setActiveGame('lobby');
    } catch (error) {
      localStorage.removeItem('token');
      setToken('');
      setUser(null);
      setScreen('login');
    }
  }

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token]);

  async function handleLogin(username, password) {
    const payload = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    localStorage.setItem('token', payload.token);
    setToken(payload.token);
    setUser(payload.user);
  }

  async function handleRegister(username, password) {
    const payload = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });

    localStorage.setItem('token', payload.token);
    setToken(payload.token);
    setUser(payload.user);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setScreen('login');
    setActiveGame('lobby');
  }

  const renderAuth = () => {
    if (screen === 'register') {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setScreen('login')} />;
    }

    return <Login onLogin={handleLogin} onSwitchToRegister={() => setScreen('register')} />;
  };

  if (!token || !user) {
    return <div className="app-shell auth-shell">{renderAuth()}</div>;
  }

  const props = {
    user,
    onRefreshUser: fetchMe,
    onBack: () => setActiveGame('lobby')
  };

  return (
    <div className="app-shell">
      {activeGame === 'lobby' && (
        <Lobby user={user} onRefreshUser={fetchMe} onSelectGame={setActiveGame} onLogout={handleLogout} />
      )}

      {activeGame === 'dragon' && <DragonTiger {...props} />}
      {activeGame === 'coin' && <CoinToss {...props} />}
      {activeGame === 'aviator' && <Aviator {...props} />}
    </div>
  );
}
