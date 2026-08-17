import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080808',
      color: '#f0ede8',
      fontFamily: 'sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>404 - Page Not Found</h2>
      <p style={{ color: '#8a8680', marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
      <Link
        href="/"
        style={{
          padding: '0.8rem 2rem',
          borderRadius: '999px',
          background: '#e02020',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
