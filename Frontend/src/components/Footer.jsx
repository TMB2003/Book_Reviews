export default function Footer() {
  return (
    <footer style={{ padding: '16px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
      <small>
        © {new Date().getFullYear()} @Taha Balapurwala ·
        {' '}<a href="https://www.linkedin.com/in/taha-balapurwala/" target="_blank" rel="noreferrer">LinkedIn</a>
      </small>
    </footer>
  );
}
