
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    college_name: '',
    branch: '',
    year_of_study: '',
    skills: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://127.0.0.1:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed.');
      }

      navigate('/login', {
        state: { registrationSuccess: true },
      });

    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Please check whether the backend is running.'
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
          <h2>Create Your Account</h2>
          <p>Start building your career journey with us.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>College Name</label>
          <input
            type="text"
            name="college_name"
            placeholder="Enter your college name"
            value={formData.college_name}
            onChange={handleChange}
            required
          />

          <label>Branch</label>
          <select
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your branch</option>
            <option value="CSE">Computer Science</option>
            <option value="ISE">Information Science</option>
            <option value="AIML">AI and Machine Learning</option>
            <option value="ECE">Electronics and Communication</option>
            <option value="Other">Other</option>
          </select>

          <label>Year of Study</label>
          <select
            name="year_of_study"
            value={formData.year_of_study}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select your year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <label>Skills</label>
          <input
            type="text"
            name="skills"
            placeholder="Example: Python, Java, C"
            value={formData.skills}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            minLength="8"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;
