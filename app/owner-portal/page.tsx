import { OwnerPortalClient } from "./client"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Owner Portal | Valar Travel",
  description: "Manage your Valar Travel platform - properties, analytics, database, and more.",
  robots: "noindex, nofollow",
}

export default function OwnerPortalPage() {
  return (
    <AdminAuthGuard>
      <OwnerPortalClient />
    </AdminAuthGuard>
  )
}
