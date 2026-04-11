import { v2 as cloudinary } from 'cloudinary'

export default cloudinary

// ── Upload image from buffer ──────────────────────────
export async function uploadImage(
  buffer: Buffer,
  options: {
    folder?: string
    public_id?: string
  } = {}
): Promise<{
  public_id: string
  url: string
  secure_url: string
  width: number
  height: number
}> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: options.folder ?? 'albaeon/products',
          public_id: options.public_id,
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Upload failed'))
            return
          }
          resolve({
            public_id: result.public_id,
            url: result.url,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
          })
        }
      )
      .end(buffer)
  })
}

// ── Delete image by public_id ─────────────────────────
export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

// ── Get optimised URL ─────────────────────────────────
export function getOptimisedUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string | number
  } = {}
): string {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    quality: options.quality ?? 'auto',
    fetch_format: 'auto',
    crop: 'fill',
    secure: true,
  })
}