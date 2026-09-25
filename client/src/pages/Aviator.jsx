import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Aviator({ user, onRefreshUser, onBack }) {
  const [socketState, setSocketState] = useState({
    round: 1,
    status: 'betting',
    multiplier: 1,
    crashAt: null,
    duration: 0,
    bets: []
  });
  const [bet, setBet] = useState(25);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const gameSocket = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(gameSocket);

    gameSocket.on('connect', () => {
      gameSocket.emit('join-room');
      gameSocket.emit('auth', token);
    });

    gameSocket.on('aviator:update', (nextState) => {
      setSocketState(nextState);
    });

    gameSocket.on('aviator:error', (err) => {
      setMessage(err);
    });

    gameSocket.on('aviator:cashout', (payload) => {
      setMessage(`Cashed out at ${payload.multiplier}x for ${payload.payout} chips.`);
      onRefreshUser();
    });

    return () => {
      gameSocket.disconnect();
    };
  }, [onRefreshUser]);

  function handlePlaceBet() {
    if (!socket) return;
    socket.emit('place-bet', { amount: Number(bet) });
    setMessage('Bet placed for the next round.');
  }

  function handleCashOut() {
    if (!socket) return;
    socket.emit('cash-out');
  }

  const hasActiveBet = socketState.bets.some((entry) => entry.userId === user.id && entry.cashoutMultiplier === null);

  return (
    <div className="game-page">
      <button type="button" className="secondary back-button" onClick={onBack}>← Back to lobby</button>
      <div className="panel aviator-panel">
        <div className="aviator-header">
          <div>
            <h2>Aviator</h2>
            <p className="muted">Round {socketState.round}</p>
          </div>
          <div className="multiplier-pill">{socketState.multiplier.toFixed(2)}x</div>
        </div>

        <div className="status-row">
          <span>Status: {socketState.status}</span>
          <span>Crash: {socketState.crashAt ? `${socketState.crashAt.toFixed(2)}x` : 'Pending'}</span>
        </div>

        <div className="bet-controls">
          <input type="number" min="10" step="5" value={bet} onChange={(e) => setBet(e.target.value)} />
          <button type="button" onClick={handlePlaceBet} disabled={socketState.status !== 'betting'}>Place bet</button>
          <button type="button" className="secondary" onClick={handleCashOut} disabled={!hasActiveBet}>Cash out</button>
        </div>

        {message && <p className="info-box">{message}</p>}

        <div className="players-list">
          <h3>Players at this table</h3>
          {socketState.bets.length === 0 ? (
            <p className="muted">No active bets yet. Place your first one.</p>
          ) : (
            socketState.bets.map((entry) => (
              <div key={`${entry.userId}-${entry.amount}-${entry.username}`} className="player-row">
                <span>{entry.username}</span>
                <span>{entry.amount} chips</span>
                <span>{entry.cashoutMultiplier ? `${entry.cashoutMultiplier.toFixed(2)}x` : 'Live'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
