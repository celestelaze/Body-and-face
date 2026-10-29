import { fetchSheetProducts } from '../../../lib/sheets'
export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await fetchSheetProducts()
  return Response.json(data, { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } })
}
