'use client'

import { useEffect } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'

export default function WishlistSync() {
  const syncWithSupabase = useWishlistStore((s) => s.syncWithSupabase)
  const items = useWishlistStore((s) => s.items)

  // Write cookie on every mount so server can read it
  useEffect(() => {
    if (items.length > 0) {
      document.cookie = `albaeon-wishlist=${JSON.stringify(items)};path=/;max-age=${60 * 60 * 24 * 30}`
    }
    syncWithSupabase()
  }, [items, syncWithSupabase])

  return null
}