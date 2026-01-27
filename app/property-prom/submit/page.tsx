import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import SubmitPropertyClient from "./client"

export const metadata: Metadata = {
  title: "Submit Your Property | Property Prom by Valar Travel",
  description:
    "Submit your luxury Caribbean villa to be featured in Property Prom, our exclusive virtual showcase of handpicked estates.",
}

export default async function SubmitPropertyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login?redirect=/property-prom/submit")
  }

  // Fetch countries for the dropdown
  const { data: countries } = await supabase.from("property_prom_countries").select("code, name").order("name")

  return <SubmitPropertyClient user={user} countries={countries || []} />
}
