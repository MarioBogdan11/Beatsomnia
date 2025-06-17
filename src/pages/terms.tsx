import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.7s",
        padding: "2rem",
        maxWidth: "600px",
        margin: "2rem auto",
        background: "#181848",
        color: "#fff",
        borderRadius: "12px"
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          display: "block",
          margin: "0 0 2rem auto",
          padding: "0.6rem 1.2rem",
          fontWeight: "bold",
          color: "#fff",
          background: "#3b3bff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "background 0.2s"
        }}
        onMouseOver={e => (e.currentTarget.style.background = "#5f5fff")}
        onMouseOut={e => (e.currentTarget.style.background = "#3b3bff")}
      >
        Back to Home
      </button>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Terms and Privacy Policy
      </h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By using BeatSomnia, you agree to these Terms and Privacy Policy. If you do not agree, please do not use the service.
      </p>
      <h2>2. Service Description</h2>
      <p>
        BeatSomnia provides sleep-related tools for informational purposes only. No medical advice is provided.
      </p>
      <h2>3. User Responsibility</h2>
      <ul>
        <li>Your use of this service is at your own risk.</li>
        <li>You are responsible for any data you submit.</li>
        <li>No illegal or harmful materials allowed.</li>
      </ul>
      <h2>4. Data & Privacy</h2>
      <ul>
        <li>We may collect anonymous usage data to improve the service.</li>
        <li>No sensitive personal data is intentionally collected.</li>
        <li>Third-party services may collect data as described in their own policies.</li>
      </ul>
      <h2>5. Changes and Availability</h2>
      <ul>
        <li>We may update or discontinue any part of the service at any time.</li>
        <li>We may update these Terms at any time.</li>
        <li>BeatSomnia is provided as-is, without warranty.</li>
      </ul>
      <h2>6. Jurisdiction</h2>
      <p>
        This agreement is governed by the laws of your local jurisdiction.
      </p>
      <h2>7. Contact</h2>
      <p>
        For questions, contact: <a href="mailto:beatsomniaapp@gmail.com" style={{ color: "#6cf" }}>info@beatsomnia.com</a>
      </p>
      <div style={{ marginTop: "2rem", textAlign: "center", opacity: 0.7 }}>
        © {new Date().getFullYear()} BeatSomnia
      </div>
    </div>
  );
};

export default Terms;