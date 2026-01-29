import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/vendor/subscription/plan"); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* Animated Cross */}
      <div style={styles.cross}>❌</div>

      <h1 style={styles.title}>Payment Failed!</h1>
      <p style={styles.subtitle}>
        Unfortunately, your payment could not be processed. Please try again.
      </p>

      {/* CTA Buttons */}
      <div style={styles.buttons}>
        <button style={styles.button} onClick={() => navigate("/vendor/subscription/plan")}>
          Go to Home
        </button>
       
      </div>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #E57373 0%, #D32F2F 100%)",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  cross: {
    fontSize: "5rem",
    marginBottom: "20px",
    animation: "shake 0.5s ease-in-out infinite",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "15px",
  },
  subtitle: {
    fontSize: "1.2rem",
    maxWidth: "400px",
    marginBottom: "30px",
  },
  buttons: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    padding: "10px 25px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#fff",
    color: "#D32F2F",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default PaymentFailed;
