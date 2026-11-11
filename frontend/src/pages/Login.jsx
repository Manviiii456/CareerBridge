
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Register.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);

      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed.');
      }

      // Save the login token
      localStorage.setItem('access_token', data.access_token);

      // Redirect to Dashboard
      navigate('/dashboard');

    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to server. Please check your backend.'
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-heading">
          <h1>Career<span>Bridge</span></h1>
          <h2>Welcome Back!</h2>
          <p>Login to continue your career journey.</p>
        </div>

        {location.state?.registrationSuccess && (
          <p className="auth-success">
            Registration successful! Please log in.
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Login;
