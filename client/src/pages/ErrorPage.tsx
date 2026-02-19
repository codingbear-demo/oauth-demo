import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="card">
        <div className="error-icon">✕</div>
        <h1>로그인 실패</h1>
        <p>Google 인증 중 오류가 발생했습니다.</p>
        <button className="btn btn-google" onClick={() => navigate('/')}>
          다시 로그인
        </button>
      </div>
    </div>
  );
}
