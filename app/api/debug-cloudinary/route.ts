import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret_length: process.env.CLOUDINARY_API_SECRET?.length,
    api_secret_first4: process.env.CLOUDINARY_API_SECRET?.substring(0, 4),
    api_secret_last4: process.env.CLOUDINARY_API_SECRET?.slice(-4),
  })
}