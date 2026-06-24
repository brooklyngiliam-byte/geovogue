import { useCallback } from 'react'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function Pin({ color, size = 12 }) {
  return (
    <div style={{
      width: size,
      height: size,
      background: color,
      border: '2px solid #FAF6F1',
      borderRadius: '50%',
      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      transform: 'translate(-50%, -50%)',
    }} />
  )
}

// Layer ID prefixes to hide entirely — roads, buildings, POI, transit, etc.
const HIDE_PREFIXES = [
  'road', 'bridge', 'tunnel', 'turning',
  'building', 'poi', 'transit', 'aeroway',
  'ferry', 'airport', 'parking', 'gate',
  'pedestrian', 'path', 'track', 'motorway',
  'link', 'railway', 'level-crossing',
  'contour', 'hillshade', 'national-park',
  'landuse', 'landcover',
]

function handleLoad(e) {
  const map = e.target

  for (const layer of map.getStyle().layers) {
    const id = layer.id.toLowerCase()

    // Hide all labels
    if (layer.type === 'symbol') {
      map.setLayoutProperty(layer.id, 'visibility', 'none')
      continue
    }

    // Hide everything that isn't land/water/borders
    if (HIDE_PREFIXES.some(p => id.startsWith(p))) {
      map.setLayoutProperty(layer.id, 'visibility', 'none')
      continue
    }
  }

  function trySet(id, prop, val) {
    try { if (map.getLayer(id)) map.setPaintProperty(id, prop, val) } catch {}
  }

  trySet('background',   'background-color', '#ddd8d0')
  trySet('land',         'fill-color',       '#FAF6F1')
  trySet('water',        'fill-color',       '#ddd8d0')
  trySet('water-shadow', 'fill-color',       '#ddd8d0')

  // Find all admin/boundary line layers dynamically
  for (const layer of map.getStyle().layers) {
    if (layer.type !== 'line') continue
    const src = layer['source-layer']
    if (src !== 'admin' && src !== 'country_boundaries' && src !== 'boundaries') continue

    const id = layer.id.toLowerCase()
    const isBg    = id.includes('bg') || id.includes('casing')
    const isState = id.includes('-1-') || id.includes('state') || id.includes('province')

    try {
      if (isBg) {
        map.setPaintProperty(layer.id, 'line-color', '#FAF6F1')
      } else if (isState) {
        map.setPaintProperty(layer.id, 'line-color', '#7D2640')
        map.setPaintProperty(layer.id, 'line-opacity', 0.2)
        map.setPaintProperty(layer.id, 'line-width', 0.5)
      } else {
        map.setPaintProperty(layer.id, 'line-color', '#7D2640')
        map.setPaintProperty(layer.id, 'line-opacity', 0.7)
        map.setPaintProperty(layer.id, 'line-width', 1)
      }
    } catch {}
  }
}

export default function MapView({ phase, pendingGuess, confirmedGuess, answer, onMapClick }) {
  const clickEnabled = phase === 'guessing'

  const handleClick = useCallback((e) => {
    if (!clickEnabled) return
    onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng })
  }, [clickEnabled, onMapClick])

  return (
    <Map
      mapboxAccessToken={TOKEN}
      initialViewState={{ longitude: 10, latitude: 20, zoom: 1.5 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      cursor={clickEnabled ? "url('/miffy.svg') 20 48, crosshair" : 'auto'}
      onClick={handleClick}
      onLoad={handleLoad}
    >
      {pendingGuess && phase === 'guessing' && (
        <Marker longitude={pendingGuess.lng} latitude={pendingGuess.lat} anchor="center">
          <Pin color="#7D2640" />
        </Marker>
      )}

      {confirmedGuess && (
        <Marker longitude={confirmedGuess.lng} latitude={confirmedGuess.lat} anchor="center">
          <Pin color="#7D2640" />
        </Marker>
      )}

      {answer && (
        <Marker longitude={answer.lng} latitude={answer.lat} anchor="center">
          <Pin color="#1A1A1A" size={14} />
        </Marker>
      )}
    </Map>
  )
}
