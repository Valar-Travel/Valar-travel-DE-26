import { EmailTestingPanel } from "@/components/admin/email-testing-panel"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"

export default function EmailTestingPage() {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50">
        <EmailTestingPanel />
      </div>
    </AdminAuthGuard>
  )
}
