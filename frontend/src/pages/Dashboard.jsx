
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch logged-in student's profile
  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('access_token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('access_token');
            navigate('/login');
            return;
          }

          throw new Error(data.detail || 'Unable to fetch profile.');
        }

        setStudent(data.student);
      } catch (err) {
        setError(
          err.message === 'Failed to fetch'
            ? 'Cannot connect to the backend. Please check your server.'
            : err.message
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [navigate]);

  // Logout
  function handleLogout() {
    localStorage.removeItem('access_token');
    navigate('/login');
  }

  // Open edit profile form
  function handleEdit() {
    setFormData({
      full_name: student.full_name || '',
      college_name: student.college_name || '',
      branch: student.branch || '',
      year_of_study: student.year_of_study || '',
      skills: student.skills || '',
    });

    setUpdateMessage('');
    setUpdateError('');
    setIsEditing(true);
  }

  // Update profile in MongoDB
  async function handleUpdateProfile(event) {
    event.preventDefault();

    setSaving(true);
    setUpdateMessage('');
    setUpdateError('');

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Profile update failed.');
      }

      setStudent(data.student);
      setIsEditing(false);
      setUpdateMessage('Profile updated successfully!');
    } catch (err) {
      setUpdateError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the backend.'
          : err.message
      );
    } finally {
      setSaving(false);
    }
  }

  // Handle changes in form fields
  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  // Loading screen
  if (loading) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <h2>Loading your dashboard...</h2>
        </main>
      </div>
    );
  }

  // Error screen
  if (error || !student) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-main">
          <h2>Unable to load dashboard</h2>
          <p>{error || 'Student profile not found.'}</p>
          <Link to="/login">Go to Login</Link>
        </main>
      </div>
    );
  }

  // Calculate skills and profile completion
  const skillsList = student.skills
    ? student.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    : [];

  const profileFields = [
    student.full_name,
    student.email,
    student.college_name,
    student.branch,
    student.year_of_study,
    student.skills,
  ];

  const completedFields = profileFields.filter(
    (field) => field && field.trim() !== ''
  ).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100
  );

  const initial = student.full_name
    ? student.full_name.charAt(0).toUpperCase()
    : 'S';

  return (
    <div className="dashboard-page">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h2>
          Career<span>Bridge</span>
        </h2>

        <nav>
          <Link to="/dashboard" className="active">Dashboard</Link>
          <Link to="/internships">Internships</Link>
          <Link to="/applications">My Applications</Link>
          <Link to="/skills">Skill Analysis</Link>
          <Link to="/peer-learning">Peer Learning</Link>
          <Link to="/services">Student Services</Link>
        </nav>

        <button
          type="button"
          className="logout-link"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>Welcome, {student.full_name}!</h1>
            <p>Here's an overview of your career journey.</p>
          </div>

          <div className="profile-circle">{initial}</div>
        </header>

        {/* Welcome Section */}
        <section className="dashboard-welcome">
          <h2>Your Career Journey Starts Here</h2>
          <p>
            Explore opportunities, develop your skills and
            take the next step towards your dream career.
          </p>
        </section>

        {/* Student Profile Section */}
        <section className="dashboard-section">

          <div className="profile-section-header">
            <h2>Your Student Profile</h2>

            {!isEditing && (
              <button
                type="button"
                className="edit-profile-btn"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>

          {updateMessage && (
            <p className="profile-success">{updateMessage}</p>
          )}

          {updateError && (
            <p className="profile-error">{updateError}</p>
          )}

          {/* Edit Form */}
          {isEditing ? (

            <form
              className="dashboard-card edit-profile-form"
              onSubmit={handleUpdateProfile}
            >
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                minLength={2}
                required
              />

              <label>College Name</label>
              <input
                type="text"
                name="college_name"
                value={formData.college_name}
                onChange={handleInputChange}
                required
              />

              <label>Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
              />

              <label>Year of Study</label>
              <input
                type="text"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleInputChange}
                required
              />

              <label>Skills (separate with commas)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="Python, Java, C"
              />

              <div className="profile-form-buttons">
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>

          ) : (

            /* Display Profile */
            <div className="dashboard-card">
              <h3>{student.full_name}</h3>

              <p>
                <strong>Email:</strong> {student.email}
              </p>

              <p>
                <strong>College:</strong> {student.college_name}
              </p>

              <p>
                <strong>Branch:</strong> {student.branch}
              </p>

              <p>
                <strong>Year:</strong> {student.year_of_study}
              </p>

              <p>
                <strong>Skills:</strong>{' '}
                {skillsList.length > 0
                  ? skillsList.join(', ')
                  : 'No skills added yet'}
              </p>
            </div>

          )}

        </section>

        {/* Dashboard Statistics */}
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
            <h3>{skillsList.length}</h3>
            <p>Skills Added</p>
          </div>

          <div className="stat-card">
            <h3>{profileCompletion}%</h3>
            <p>Profile Completion</p>
          </div>

        </section>

        {/* Explore CareerBridge */}
        <section className="dashboard-section">
          <h2>Explore CareerBridge</h2>

          <div className="dashboard-cards">

            <div className="dashboard-card">
              <h3>Find Internships</h3>
              <p>
                Discover internship opportunities that match your interests.
              </p>
              <Link to="/internships">Explore →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Track Applications</h3>
              <p>
                Keep track of your internship applications in one place.
              </p>
              <Link to="/applications">View Applications →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Skill Gap Analysis</h3>
              <p>
                Identify the skills you need to improve for your career goals.
              </p>
              <Link to="/skills">Analyse Skills →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Peer Learning</h3>
              <p>
                Connect with students and learn together.
              </p>
              <Link to="/peer-learning">Explore →</Link>
            </div>

            <div className="dashboard-card">
              <h3>Student Services</h3>
              <p>
                Offer or request useful services from fellow students.
              </p>
              <Link to="/services">Explore →</Link>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
