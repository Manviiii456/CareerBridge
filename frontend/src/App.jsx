import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function Home() {
  return (
    <div className="app">

      {/* Navigation Bar */}
      <nav className="navbar">
        <h2 className="logo">Career<span>Bridge</span></h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#internships">Internships</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
  Login
</Link>
          <Link to="/register" className="signup-btn">
 Get Started
</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">YOUR CAREER JOURNEY STARTS HERE</p>

          <h1>
            Build Your Future.
            <br />
            <span>Bridge Your Dreams.</span>
          </h1>

          <p className="hero-description">
            Discover internships, develop new skills, prepare for
            placements and connect with students. Everything you
            need to grow your career, all in one place.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Explore Opportunities →
            </button>
            <button className="secondary-btn">
              Learn More
            </button>
          </div>

          <p className="hero-note">
            Learn together. Grow together. Succeed together.
          </p>
        </div>

        <div className="hero-card">
          <div className="card-icon">🎓</div>
          <h3>Your Career Starts Today</h3>
          <p>Learn • Connect • Grow</p>
          <div className="career-stats">
            <div>
              <h2>01</h2>
              <p>Discover</p>
            </div>
            <div>
              <h2>02</h2>
              <p>Develop</p>
            </div>
            <div>
              <h2>03</h2>
              <p>Succeed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-heading">
          <p>WHAT WE OFFER</p>
          <h2>Everything You Need to Grow</h2>
          <span>
            One platform. Multiple opportunities. Endless possibilities.
          </span>
        </div>

        <div className="feature-grid">

          <div className="feature-card" id="internships">
            <div className="feature-icon">💼</div>
            <h3>Find Internships</h3>
            <p>
              Discover internship opportunities that match your
              interests and career goals.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Applications</h3>
            <p>
              Manage your applications and monitor your placement
              journey in one place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Analyze Your Skills</h3>
            <p>
              Identify skill gaps and understand what you need
              to learn for your dream role.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Peer Learning</h3>
            <p>
              Connect with fellow students and exchange knowledge
              and skills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Student Services</h3>
            <p>
              Share your skills and offer useful services to
              other students.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Career Growth</h3>
            <p>
              Prepare for placements and take the next step
              towards your professional goals.
            </p>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <h2>One Bridge. Many Opportunities.</h2>
        <p>
          CareerBridge brings students, opportunities and
          knowledge together to make career development easier.
        </p>
      </section>

      {/* Footer */}
      <footer>
        <h2>Career<span>Bridge</span></h2>
        <p>Connecting Students. Creating Opportunities.</p>
        <p>© 2026 CareerBridge. All rights reserved.</p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
