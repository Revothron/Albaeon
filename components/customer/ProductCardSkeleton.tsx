export default function ProductCardSkeleton() {
  return (
    <div style={{
      border: '1px solid rgba(230,201,121,0.06)',
      background: 'var(--albaeon-surface, #2C2040)',
    }}>
      <div
        className="skeleton"
        style={{ aspectRatio: '1/1', width: '100%' }}
      />
      <div style={{ padding: '12px 16px' }}>
        <div
          className="skeleton"
          style={{
            height: '14px',
            width: '70%',
            marginBottom: '8px'
          }}
        />
        <div
          className="skeleton"
          style={{ height: '12px', width: '35%' }}
        />
      </div>
    </div>
  );
}
