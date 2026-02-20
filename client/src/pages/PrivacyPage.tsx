import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="page legal-page">
      <div className="card legal-card">
        <h1>Privacy Policy</h1>
        <div className="legal-body">
          <p><strong>Last updated:</strong> February 20, 2026</p>

          <h2>Overview</h2>
          <p>
            This application is a <strong>demonstration project</strong> built
            to showcase Google OAuth 2.0 authentication. It is not a commercial
            product or service.
          </p>

          <h2>What We Collect</h2>
          <p>
            When you sign in with Google, we receive your <strong>name</strong>,{' '}
            <strong>email address</strong>, and <strong>profile provider</strong>{' '}
            from your Google account. This information is used solely to
            demonstrate the OAuth login flow.
          </p>

          <h2>How We Store It</h2>
          <p>
            All user data is stored <strong>in-memory only</strong> on the
            server. Data is automatically deleted when the server restarts. We do
            not use a database, and no data is written to disk.
          </p>

          <h2>What We Do NOT Do</h2>
          <ul>
            <li>We do not store your Google access or refresh tokens.</li>
            <li>We do not share your data with any third party.</li>
            <li>We do not use cookies for tracking or advertising.</li>
            <li>We do not send emails or notifications.</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            A single session cookie (<code>connect.sid</code>) is used to
            maintain your login session. It is removed when you log out or when
            it expires after 24 hours.
          </p>

          <h2>Data Deletion</h2>
          <p>
            You can delete your data at any time by clicking the{' '}
            <strong>Logout</strong> button. This destroys your session and
            removes your data from server memory.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this demo, please reach out via the
            project's GitHub repository.
          </p>
        </div>
        <Link to="/" className="btn btn-google">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
