export const maxDuration = 30

export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Chat service is currently using smart responses. No API calls needed.",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  )
}
