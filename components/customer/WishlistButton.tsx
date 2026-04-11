'use client'

import { useEffect, useState } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useUiStore } from '@/store/uiStore'
import { useRouter } from 'next/navigation'

interface WishlistButtonProps {
  productId: string
  className?: string
  style?: React.CSSProperties
}

export default function WishlistButton({
  productId,
  className,
  style,
}: WishlistButtonProps) {
  const toggle = useWishlistStore((s) => s.toggle)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist)
  const addToast = useUiStore((s) => s.addToast)
  const router = useRouter()

  // ── Defer to client only to prevent hydration mismatch ──
  const [mounted, setMounted] = useState(false)
  const [isIn, setIsIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsIn(isInWishlist(productId))
  }, [productId, isInWishlist])

  // Keep in sync when store changes
  useEffect(() => {
    if (!mounted) return
    setIsIn(isInWishlist(productId))
  }, [mounted, productId, isInWishlist])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(productId)
    const nowIn = !isIn
    setIsIn(nowIn)
    addToast({
      message: nowIn ? 'Added to wishlist' : 'Removed from wishlist',
      type: nowIn ? 'success' : 'info',
    })
    router.refresh()
  }

  // ── Render neutral state on server / before mount ──────
  if (!mounted) {
    return (
      <button
        aria-label="Add to wishlist"
        className={className}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--albaeon-text-muted, #B7AFC3)',
          ...style,
        }}
      >
        ♡
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      aria-label={isIn ? 'Remove from wishlist' : 'Add to wishlist'}
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
  )
}