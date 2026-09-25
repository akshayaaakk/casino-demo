import { useState } from 'react';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await onRegister(username, password);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  }

  return (
    <div className="auth-card">
      <h1>Create a demo account</h1>
      <p className="muted">You start with 1,000 free demo chips.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="player_01" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="minimum 6 chars" />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Create account</button>
      </form>
      <p className="switch-text">
        Already have an account? <button type="button" className="link-button" onClick={onSwitchToLogin}>Log in</button>
      </p>
    </div>
  );
}
