import { useState } from 'react';
import { api } from '../api';

export default function CoinToss({ user, onRefreshUser, onBack }) {
  const [pick, setPick] = useState('heads');
  const [bet, setBet] = useState(20);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handlePlay() {
    setError('');
    setResult(null);

    try {
      const payload = await api('/api/games/coin-toss/play', {
        method: 'POST',
        body: JSON.stringify({ pick, bet: Number(bet) })
      });

      setResult(payload);
      onRefreshUser();
    } catch (err) {
      setError(err.message || 'Could not play Coin Toss.');
    }
  }

  return (
    <div className="game-page">
      <button type="button" className="secondary back-button" onClick={onBack}>← Back to lobby</button>
      <div className="panel">
        <h2>Head or Tail</h2>
        <div className="option-row">
          <button type="button" className={pick === 'heads' ? 'selected' : ''} onClick={() => setPick('heads')}>Heads</button>
          <button type="button" className={pick === 'tails' ? 'selected' : ''} onClick={() => setPick('tails')}>Tails</button>
        </div>

        <label>
          Bet amount
          <input type="number" min="5" step="5" value={bet} onChange={(e) => setBet(e.target.value)} />
        </label>

        {error && <p className="error">{error}</p>}
        <button type="button" onClick={handlePlay}>Flip coin</button>

        {result && (
          <div className="result-box">
            <p><strong>Coin:</strong> {result.result}</p>
            <p><strong>Paid out:</strong> {result.payout} chips</p>
            <p><strong>Balance:</strong> {result.balance} chips</p>
          </div>
        )}
      </div>
    </div>
  );
}
