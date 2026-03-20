'use client';
import { useUiStore } from '@/store/uiStore';

export default function AnnouncementBar() {
  const visible = useUiStore((state) =>
    state.announcementVisible);
  const hide = useUiStore((state) =>
    state.hideAnnouncement);

  if (!visible) return null;

  return (
    <div
      className="animate-slideInDown"
      style={{
        width: '100%',
        height: '36px',
        background: 'var(--albaeon-footer, #0F0C14)',
        borderBottom: '1px solid rgba(230,201,121,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <p style={{
        margin: 0,
        fontFamily: 'inherit',
        fontSize: '11px',
        fontWeight: 300,
        color: 'var(--albaeon-text-muted, #B7AFC3)',
        letterSpacing: '2px',
        textAlign: 'center',
        padding: '0 40px',
      }}>
        Free shipping on orders above ₹999
        &nbsp;·&nbsp;
        Delivered across India
      </p>
      <button
        onClick={hide}
        aria-label="Close announcement"
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--albaeon-text-muted, #B7AFC3)',
          fontSize: '16px',
          padding: '4px 8px',
          lineHeight: 1,
          transition: 'color 0.3s ease',
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.color =
          'var(--albaeon-gold, #E6C979)')
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.color =
          'var(--albaeon-text-muted, #B7AFC3)')
        }
      >
        ×
      </button>
    </div>
  );
}
