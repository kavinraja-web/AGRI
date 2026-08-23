import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (color, number = '') => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: white;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 14px;
      ">
        ${number}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const userIcon = createIcon('#3b82f6', '📍'); // Blue
const farmerIcon = (num) => createIcon('#16a34a', num); // Green

function MapBounds({ route, startLoc }) {
  const map = useMap();
  useEffect(() => {
    if (!route || !startLoc) return;
    const bounds = L.latLngBounds([startLoc.lat, startLoc.lng]);
    route.stops.forEach(stop => {
      bounds.extend([stop.lat, stop.lng]);
    });
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, route, startLoc]);
  return null;
}

export default function RouteMap({ route, startLocation }) {
  if (!startLocation) return null;

  const positions = [
    [startLocation.lat, startLocation.lng],
    ...(route?.stops || []).map(s => [s.lat, s.lng])
  ];

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
      <MapContainer 
        center={[startLocation.lat, startLocation.lng]} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Start Location Marker */}
        <Marker position={[startLocation.lat, startLocation.lng]} icon={userIcon}>
          <Popup>
            <strong>Starting Location</strong>
          </Popup>
        </Marker>

        {/* Route Polyline */}
        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="#16a34a" 
            weight={4} 
            opacity={0.7} 
            dashArray="10, 10" 
          />
        )}

        {/* Farmer Stops */}
        {route?.stops?.map((stop, index) => (
          <Marker 
            key={stop.farmerId} 
            position={[stop.lat, stop.lng]} 
            icon={farmerIcon(index + 1)}
          >
            <Popup>
              <div className="p-1">
                <strong className="text-forest-800 block mb-1">{stop.farmerName}</strong>
                <ul className="text-xs space-y-1 pl-3 list-disc">
                  {stop.itemsToBuy.map(item => (
                    <li key={item.reqId}>{item.reqName} ({item.reqQuantity} {item.unit})</li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        ))}

        <MapBounds route={route} startLoc={startLocation} />
      </MapContainer>
    </div>
  );
}
