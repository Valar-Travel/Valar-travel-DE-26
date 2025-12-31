declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: {
        event_category?: string
        event_label?: string
        deal_id?: string
        deal_city?: string
        deal_price?: number
        discount_type?: string
        [key: string]: any
      },
    ) => void
    chrome?: {
      runtime?: {
        lastError?: { message: string }
      }
    }
  }
}

export {}
