import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function checkPropertyCount() {
  // Get total count
  const totalResult = await sql`SELECT COUNT(*) as count FROM scraped_luxury_properties`
  console.log("Total properties in database:", totalResult[0].count)

  // Get count by location
  const locationResult = await sql`
    SELECT location, COUNT(*) as count 
    FROM scraped_luxury_properties 
    GROUP BY location 
    ORDER BY count DESC
  `
  console.log("\nProperties by location:")
  locationResult.forEach((row: any) => {
    console.log(`  ${row.location}: ${row.count}`)
  })

  // Get count of properties with images
  const imageResult = await sql`
    SELECT 
      COUNT(*) FILTER (WHERE images IS NOT NULL AND array_length(images, 1) > 0) as with_images,
      COUNT(*) FILTER (WHERE images IS NULL OR array_length(images, 1) IS NULL) as without_images
    FROM scraped_luxury_properties
  `
  console.log("\nImage status:")
  console.log(`  With images: ${imageResult[0].with_images}`)
  console.log(`  Without images: ${imageResult[0].without_images}`)

  // Get latest 5 properties added
  const latestResult = await sql`
    SELECT id, name, location, created_at 
    FROM scraped_luxury_properties 
    ORDER BY created_at DESC 
    LIMIT 5
  `
  console.log("\nLatest 5 properties added:")
  latestResult.forEach((row: any) => {
    console.log(`  ${row.name} (${row.location}) - ${row.created_at}`)
  })
}

checkPropertyCount()
