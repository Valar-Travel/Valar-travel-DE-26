import { Suspense } from "react"
import { PropertiesAdmin } from "@/components/admin/properties-admin"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"

export const metadata = {
  title: "Property Management | Admin",
  description: "Manage scraped properties from partner sites",
}

export default function AdminPropertiesPage() {
  return (
    <AdminAuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Property Management</h1>
          <p className="text-muted-foreground mt-2">Review and manage properties scraped from partner sites</p>
        </div>

        <Suspense fallback={<div>Loading properties...</div>}>
          <PropertiesAdmin />
        </Suspense>
      </div>
    </AdminAuthGuard>
  )
}
