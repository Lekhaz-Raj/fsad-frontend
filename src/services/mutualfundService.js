
const BASE = 'https://api.mfapi.in/mf'

// Fetch all mutual fund schemes (LIST VIEW)
// Returns: [{ schemeCode, schemeName }, ...]
export const getAllSchemes = async () => {
  const response = await fetch(BASE)
  if (!response.ok) throw new Error(`getAllSchemes failed: ${response.status}`)
  return response.json()
}

// Fetch NAV history of ONE scheme (DETAIL / GRAPH VIEW)
// Returns: { meta: { fund_house, scheme_type, scheme_category, scheme_code, scheme_name },
//            data: [{ date: 'DD-MM-YYYY', nav: 'xx.xxxx' }, ...] }   (newest first)
export const getSchemeNAV = async (schemeCode) => {
  const response = await fetch(`${BASE}/${schemeCode}`)
  if (!response.ok) throw new Error(`getSchemeNAV failed for ${schemeCode}: ${response.status}`)
  return response.json()
}

// Convenience: get only the latest NAV value (string) for a scheme
export const getLatestNAV = async (schemeCode) => {
  const data = await getSchemeNAV(schemeCode)
  return data?.data?.[0]?.nav ?? null
}
