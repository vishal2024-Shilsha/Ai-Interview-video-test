import { useNavigate } from "react-router-dom";

function Unauthorized() {
    const navigate=useNavigate();
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <button href="/" onClick={() => [localStorage.clear(),navigate('/')]} >Go Home</button>
    </div>
  );
}

export default Unauthorized;
