import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/vendor/subscription/view"); // redirect after 3 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.container}>
      {/* Animated boy emoji */}
      <div style={styles.boy}>🧑‍💻</div>

      <h1 style={styles.title}>Payment Successful!</h1>
      <p style={styles.subtitle}>
        Your subscription has been processed successfully. Thank you!
      </p>
      <p style={{ marginTop: "20px", fontStyle: "italic", opacity: 0.8 }}>
        Redirecting you shortly...
      </p>

      {/* CSS animations */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-15px) rotate(-5deg); }
            50% { transform: translateY(0px) rotate(0deg); }
            75% { transform: translateY(-15px) rotate(5deg); }
            100% { transform: translateY(0) rotate(0deg); }
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
    background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
    textAlign: "center",
  },
  boy: {
    fontSize: "5rem",
    marginBottom: "20px",
    animation: "float 2s ease-in-out infinite",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "15px",
  },
  subtitle: {
    fontSize: "1.2rem",
    maxWidth: "400px",
  },
};

export default PaymentSuccess;
