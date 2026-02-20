import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="page legal-page">
      <div className="card legal-card">
        <h1>Terms of Service</h1>
        <div className="legal-body">
          <p><strong>Last updated:</strong> February 20, 2026</p>

          <h2>Purpose</h2>
          <p>
            This application is a <strong>demonstration project</strong>{' '}
            designed to showcase a Google OAuth 2.0 authentication flow. It is
            provided as-is for educational and portfolio purposes only.
          </p>

          <h2>Use of the Service</h2>
          <p>
            By signing in, you agree to authenticate with your Google account
            for the sole purpose of testing this demo. No account is created
            beyond a temporary in-memory session.
          </p>

          <h2>No Warranty</h2>
          <p>
            This demo is provided <strong>"as is"</strong> without warranty of
            any kind. The developer is not responsible for any issues arising
            from the use of this application.
          </p>

          <h2>Data Handling</h2>
          <p>
            Please refer to our <Link to="/privacy">Privacy Policy</Link> for
            details on how your data is handled. In short: your data exists only
            in server memory and is never persisted.
          </p>

          <h2>Availability</h2>
          <p>
            This demo may be taken offline or modified at any time without prior
            notice.
          </p>

          <h2>Contact</h2>
          <p>
            For questions or concerns, please reach out via the project's GitHub
            repository.
          </p>
        </div>
        <Link to="/" className="btn btn-google">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
