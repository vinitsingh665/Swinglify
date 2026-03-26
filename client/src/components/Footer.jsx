export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-text">
        © {new Date().getFullYear()} Swinglify · Indian Market Data · Built for Swing Traders
      </div>
      <div className="footer-links">
        <a href="#" onClick={(e) => e.preventDefault()}>About</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Disclaimer</a>
        <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
      </div>
    </footer>
  );
}
