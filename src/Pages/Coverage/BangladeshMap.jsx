import React, { useState, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import districts from '../../../public/serviceCanter.json'; // your 64 districts

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ FlyTo updater
const MapUpdater = ({ position, zoom }) => {
  const map = useMap();
  if (position) {
    map.flyTo(position, zoom, { animate: true, duration: 1.5 }); // smooth fly effect
  }
  return null;
};

const BangladeshMap = () => {
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState(null);
  const popupRefs = useRef({});

  const handleSearch = () => {
    const match = districts.find(d =>
      d.district.toLowerCase().includes(search.toLowerCase())
    );
    if (match) {
      setTarget([match.latitude, match.longitude]);
      setTimeout(() => {
        if (popupRefs.current[match.district]) {
          popupRefs.current[match.district].openOn(popupRefs.current[match.district]._map);
        }
      }, 300);
    } else {
      alert('District not found!');
    }
  };

  return (
    <div>
      {/* Search Box */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search district..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-md mr-2"
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Map */}
      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={[23.685, 90.3563]} zoom={6} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {districts.map((district, index) => (
            <Marker
              key={index}
              position={[district.latitude, district.longitude]}
              icon={customIcon}
              ref={el => (popupRefs.current[district.district] = el)}
            >
              <Popup>
                <strong>{district.district}</strong>
                <br />
                Covered Areas: {district.covered_area.join(', ')}
              </Popup>
            </Marker>
          ))}

          {/* ✅ Fly to target */}
          {target && <MapUpdater position={target} zoom={10} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;
