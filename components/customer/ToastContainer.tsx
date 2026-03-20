'use client';
import { useUiStore } from '@/store/uiStore';

const typeStyles: Record<string, {
  borderColor: string;
  iconColor: string;
  icon: string;
}> = {
  success: {
    borderColor: 'var(--status-success, #4CAF7D)',
    iconColor: 'var(--status-success, #4CAF7D)',
    icon: '✓',
  },
  error: {
    borderColor: 'var(--status-error, #C0392B)',
    iconColor: 'var(--status-error, #C0392B)',
    icon: '✕',
  },
  warning: {
    borderColor: 'var(--status-warning, #E6A817)',
    iconColor: 'var(--status-warning, #E6A817)',
    icon: '!',
  },
  info: {
    borderColor: 'var(--status-info, #4A90C4)',
    iconColor: 'var(--status-info, #4A90C4)',
    icon: 'i',
  },
};

export default function ToastContainer() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) =>
    state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '320px',
      width: '100%',
    }}>
      {toasts.map((toast) => {
        const style = typeStyles[toast.type];
        return (
          <div
            key={toast.id}
            className="toast-enter"
            style={{
              background: 'var(--albaeon-surface, #2C2040)',
              borderLeft: `3px solid ${style.borderColor}`,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              position: 'relative',
            }}
          >
            <span style={{
              width: '18px',
              height: '18px',
              borderRadius: '9999px',
              border: `1.5px solid ${style.borderColor}`,
              color: style.iconColor,
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: '1px',
            }}>
              {style.icon}
            </span>
            <p style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: 300,
              color: 'var(--albaeon-text-primary, #E8E2D6)',
              lineHeight: 1.5,
              fontFamily: 'inherit',
            }}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--albaeon-text-muted, #B7AFC3)',
                fontSize: '14px',
                padding: '2px 4px',
                lineHeight: 1,
                transition: 'color 0.2s ease',
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
