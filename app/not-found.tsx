import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background, #241A33)',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <p
        className="animate-fadeIn"
        style={{
          fontFamily: 'inherit',
          fontSize: 'clamp(80px, 15vw, 140px)',
          fontWeight: 300,
          color: 'rgba(183,175,195,0.15)',
          lineHeight: 1,
          margin: 0,
          letterSpacing: '-2px',
        }}
      >
        404
      </p>

      <div style={{
        width: '48px',
        height: '1px',
        background: 'var(--albaeon-gold, #E6C979)',
        margin: '20px auto',
      }} />

      <p
        className="animate-fadeIn delay-100"
        style={{
          fontFamily: 'inherit',
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 300,
          color: 'var(--albaeon-text-primary, #E8E2D6)',
          margin: '0 0 10px',
        }}
      >
        Page Not Found
      </p>

      <p
        className="animate-fadeIn delay-200"
        style={{
          fontFamily: 'inherit',
          fontSize: '13px',
          fontWeight: 300,
          color: 'var(--albaeon-text-muted, #B7AFC3)',
          margin: '0 0 36px',
          maxWidth: '360px',
          lineHeight: 1.8,
          letterSpacing: '0.5px',
        }}
      >
        The page you are looking for does not
        exist or has been moved.
      </p>

      <div
        className="animate-fadeIn delay-300"
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
        <Link href="/shop" className="btn-secondary">
          Shop Collection
        </Link>
      </div>
    </div>
  );
}
