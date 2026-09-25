import { useState } from 'react';
import { api } from '../api';

export default function DragonTiger({ user, onRefreshUser, onBack }) {
  const [side, setSide] = useState('dragon');
  const [bet, setBet] = useState(25);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handlePlay() {
    setError('');
    setResult(null);

    try {
      const payload = await api('/api/games/dragon-tiger/play', {
        method: 'POST',
        body: JSON.stringify({ side, bet: Number(bet) })
      });

      setResult(payload);
      onRefreshUser();
    } catch (err) {
      setError(err.message || 'Could not play Dragon & Tiger.');
    }
  }

  return (
    <div className="game-page">
      <button type="button" className="secondary back-button" onClick={onBack}>← Back to lobby</button>
      <div className="panel">
        <h2>Dragon & Tiger</h2>
        <div className="option-row">
          <button type="button" className={side === 'dragon' ? 'selected' : ''} onClick={() => setSide('dragon')}>Dragon</button>
          <button type="button" className={side === 'tiger' ? 'selected' : ''} onClick={() => setSide('tiger')}>Tiger</button>
        </div>

        <label>
          Bet amount
          <input type="number" min="5" step="5" value={bet} onChange={(e) => setBet(e.target.value)} />
        </label>

        {error && <p className="error">{error}</p>}
        <button type="button" onClick={handlePlay}>Play round</button>

        {result && (
          <div className="result-box">
            <p><strong>Result:</strong> {result.result}</p>
            <p><strong>Paid out:</strong> {result.payout} chips</p>
            <p><strong>Balance:</strong> {result.balance} chips</p>
          </div>
        )}
      </div>
    </div>
  );
}
