
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">
        <h2>Career<span>Bridge</span></h2>

        <nav>
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/internships">Internships</Link>
          <Link to="/applications">My Applications</Link>
          <Link to="/skills">Skill Analysis</Link>
          <Link to="/peer-learning">Peer Learning</Link>
          <Link to="/services">Student Services</Link>
        </nav>

        <Link to="/" className="logout-link">Back to Home</Link>
      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>Welcome to CareerBridge!</h1>
            <p>Here's an overview of your career journey.</p>
          </div>

          <div className="profile-circle">S</div>
        </header>

        <section className="dashboard-welcome">
          <h2>Your Career Journey Starts Here</h2>
          <p>
            Explore opportunities, develop your skills and
            take the next step towards your dream career.
          </p>
        </section>

        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>0</h3>
            <p>Applications</p>
          </div>

          <div className="stat-card">
            <h3>0</h3>
            <p>Saved Internships</p>
          </div>

          <div className="stat-card">
            <h3>0</h3>
            <p>Skills Added</p>
          </div>

          <div className="stat-card">
            <h3>0%</h3>
            <p>Profile Completion</p>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Explore CareerBridge</h2>

          <div className="dashboard-cards">

            <div className="dashboard-card">
              <h3>Find Internships</h3>
              <p>Discover internship opportunities that match your interests.</p>
              <Link to="/internships">Explore →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Track Applications</h3>
              <p>Keep track of your internship applications in one place.</p>
              <Link to="/applications">View Applications →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Skill Gap Analysis</h3>
              <p>Identify the skills you need to improve for your career goals.</p>
              <Link to="/skills">Analyse Skills →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Peer Learning</h3>
              <p>Connect with students and learn together.</p>
              <Link to="/peer-learning">Explore →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Student Services</h3>
              <p>Offer or request useful services from fellow students.</p>
              <Link to="/services">Explore →</Link>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
