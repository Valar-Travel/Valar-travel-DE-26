"use client"
import { useState, useEffect } from "react"

export function OwnerPortalClient() {
  const [editingRow, setEditingRow] = useState<any>(null)
  const [editValues, setEditValues] = useState<Record<string, any>>({})
  const [descriptionCount, setDescriptionCount] = useState<number | null>(null)
  const [enhancingDescriptions, setEnhancingDescriptions] = useState(false)
  const [descriptionsNeeded, setDescriptionsNeeded] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const pageSize = 20

  useEffect(() => {
    const fetchDescriptionsNeeded = async () => {
      const count = await checkMissingDescriptions()
      setDescriptionsNeeded(count)
    }

    fetchDescriptionsNeeded()
  }, [])

  const checkMissingDescriptions = async () => {
    try {
      const response = await fetch("/api/admin/enhance-descriptions")
      const data = await response.json()
      return data.propertiesNeedingDescriptions || 0
    } catch (error) {
      console.error("[v0] Error checking descriptions:", error)
      return 0
    }
  }

  const handleEnhanceDescriptions = async () => {
    if (!confirm("This will generate AI descriptions for all properties with missing descriptions. Continue?")) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/enhance-descriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchUpdate: true }),
      })

      const result = await response.json()

      if (result.success) {
        alert(`Successfully updated ${result.updated} property descriptions!`)
      } else {
        alert("Error: " + (result.error || "Failed to update descriptions"))
      }
    } catch (err) {
      console.error("Error enhancing descriptions:", err)
      alert("Error enhancing descriptions. Check console for details.")
    }
    setLoading(false)
  }

  return null // Component doesn't render
}
