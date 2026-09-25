import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Lobby({ user, onRefreshUser, onSelectGame, onLogout }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await api('/api/games/history');
        setHistory(data.history || []);
      } catch (error) {
        console.error('Could not load history:', error);
      }
    }

    loadHistory();
  }, [user?.balance]);

  return (
    <div className="lobby-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Demo casino</p>
          <h1>Backroom tables</h1>
        </div>
        <div className="profile-box">
          <span>{user.username}</span>
          <strong>{user.balance} chips</strong>
          <button type="button" className="secondary" onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="game-grid">
        <button type="button" className="game-card" onClick={() => onSelectGame('dragon')}>
          <span className="game-name">Dragon & Tiger</span>
          <span className="game-desc">Fast table battle with instant resolution.</span>
        </button>

        <button type="button" className="game-card" onClick={() => onSelectGame('aviator')}>
          <span className="game-name">Aviator</span>
          <span className="game-desc">Shared multiplayer flight with live multiplier.</span>
        </button>

        <button type="button" className="game-card" onClick={() => onSelectGame('coin')}>
          <span className="game-name">Head or Tail</span>
          <span className="game-desc">Quick coin flip with no need to overthink it.</span>
        </button>
      </div>

      <section className="history-panel">
        <h2>Recent play</h2>
        {history.length === 0 ? (
          <p className="muted">No plays yet. Pick a game and get rolling.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div className="history-item" key={item.id}>
                <span>{item.game_name}</span>
                <span>{item.side || item.result}</span>
                <span>{item.result || '—'}</span>
                <span>{item.payout > 0 ? `+${item.payout}` : `-${item.bet}`}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <button type="button" className="refresh-button" onClick={onRefreshUser}>Refresh balance</button>
    </div>
  );
}
