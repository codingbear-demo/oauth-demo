import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="card">
        <div className="error-icon">✕</div>
        <h1>Login Failed</h1>
        <p>An error occurred during Google authentication.</p>
        <button className="btn btn-google" onClick={() => navigate('/')}>
          Try Again
        </button>
      </div>
    </div>
  );
}
