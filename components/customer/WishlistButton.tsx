'use client';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUiStore } from '@/store/uiStore';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function WishlistButton({
  productId,
  className,
  style,
}: WishlistButtonProps) {
  const toggle = useWishlistStore((s) => s.toggle);
  const isIn = useWishlistStore((s) =>
    s.isInWishlist(productId));
  const addToast = useUiStore((s) => s.addToast);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
    addToast({
      message: isIn
        ? 'Removed from wishlist'
        : 'Added to wishlist',
      type: isIn ? 'info' : 'success',
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={isIn
        ? 'Remove from wishlist'
        : 'Add to wishlist'}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        color: isIn
          ? 'var(--albaeon-gold, #E6C979)'
          : 'var(--albaeon-text-muted, #B7AFC3)',
        transform: isIn ? 'scale(1.1)' : 'scale(1)',
        ...style,
      }}
    >
      {isIn ? '♥' : '♡'}
    </button>
  );
}
