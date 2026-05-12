-- ============================================================================
-- Migration: Add cloudinary_id to categories
-- Date:      2026-05-11
-- Purpose:   Track Cloudinary public_id for category images so old images
--            can be deleted on update/replace.
-- ============================================================================

ALTER TABLE categories ADD COLUMN IF NOT EXISTS cloudinary_id TEXT;
