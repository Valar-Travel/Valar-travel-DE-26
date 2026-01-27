import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("x-admin-auth")
    if (authHeader !== "valar-admin-logged-in") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const supabase = createAdminClient()

    const { error } = await supabase
      .from("newsletter_subscriptions")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Subscriber delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Subscriber DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    )
  }
}
