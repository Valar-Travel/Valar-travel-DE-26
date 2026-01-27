// Cache the table existence check
let crmEnabled = false
let manuallyEnabled = false

export async function checkCRMTablesExist(): Promise<boolean> {
  // If manually enabled, return true
  if (manuallyEnabled) {
    return true
  }

  // Default to disabled to prevent fetch errors
  return crmEnabled
}

// Reset cache (useful after running migrations)
export function resetCRMTableCache() {
  crmEnabled = false
  manuallyEnabled = false
}

// Enable CRM programmatically - call this after confirming tables exist
export function enableCRM() {
  crmEnabled = true
  manuallyEnabled = true
}

// Check if CRM is enabled
export function isCRMEnabled(): boolean {
  return crmEnabled || manuallyEnabled
}
