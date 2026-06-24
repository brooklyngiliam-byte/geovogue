const R = 6371 // Earth radius in km

function toRad(deg) {
  return (deg * Math.PI) / 180
}

function haversine(a, b) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinDlat = Math.sin(dLat / 2)
  const sinDlng = Math.sin(dLng / 2)
  const c = sinDlat * sinDlat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDlng * sinDlng
  return R * 2 * Math.asin(Math.sqrt(c))
}

export function calcScore(guess, answer) {
  const distance = haversine(guess, answer)
  const score = Math.round(5000 * Math.exp(-distance / 2000))
  return { score, distance }
}
