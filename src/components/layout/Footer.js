// src/components/layout/Footer.js
import { MEDICAL_DISCLAIMER } from "@/utils/constants";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} OrthoInsight — AI-Powered Orthopedic
          Assistant
        </p>
        <p className="footer-disclaimer">{MEDICAL_DISCLAIMER}</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
