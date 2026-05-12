import { requireAdminPage } from '@/lib/auth/require-admin-page'
import AdminSupportInbox from '@/components/admin/AdminSupportInbox'

export const dynamic = 'force-dynamic';

export default async function AdminSupportPage() {
  await requireAdminPage()

  return (
    <div className="animate-fadeInUp">
      <AdminSupportInbox />
    </div>
  )
}