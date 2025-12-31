export function format(date: Date, formatStr: string): string {
  if (!date || isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const fullMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  switch (formatStr) {
    case "MMM dd":
      return `${months[month]} ${day.toString().padStart(2, "0")}`
    case "MMM d":
      return `${months[month]} ${day}`
    case "MMM d, yyyy":
      return `${months[month]} ${day}, ${year}`
    case "PPP":
      return `${fullMonths[month]} ${day}, ${year}`
    case "yyyy-MM-dd":
      return `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    default:
      return date.toLocaleDateString()
  }
}

export function formatDistanceToNow(date: Date, options?: { addSuffix?: boolean }): string {
  if (!date || isNaN(date.getTime())) {
    return "Invalid Date"
  }

  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  let result = ""

  if (diffInMinutes < 1) {
    result = "less than a minute"
  } else if (diffInMinutes < 60) {
    result = `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}`
  } else if (diffInHours < 24) {
    result = `${diffInHours} hour${diffInHours === 1 ? "" : "s"}`
  } else if (diffInDays < 30) {
    result = `${diffInDays} day${diffInDays === 1 ? "" : "s"}`
  } else {
    const diffInMonths = Math.floor(diffInDays / 30)
    result = `${diffInMonths} month${diffInMonths === 1 ? "" : "s"}`
  }

  return options?.addSuffix ? `${result} ago` : result
}
