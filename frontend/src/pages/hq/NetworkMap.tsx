import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, TrendingUp } from 'lucide-react';

// Custom marker icon creator
const createCustomIcon = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -10]
});

const BRANCHES = [
  { id: 1, name: 'Virar Branch', status: 'Excellent', purity: 98, lat: 19.47, lng: 72.8, color: '#0F9D58' },
  { id: 2, name: 'Pune Branch', status: 'Good', purity: 92, lat: 18.52, lng: 73.85, color: '#F4B400' },
  { id: 3, name: 'Dombivali Branch', status: 'Attention', purity: 89, lat: 19.21, lng: 73.08, color: '#DB4437' },
  { id: 4, name: 'Powai Branch', status: 'Excellent', purity: 96, lat: 19.12, lng: 72.91, color: '#0F9D58' },
];

export default function NetworkMap() {
  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-normal text-on-surface">Network Map</h2>
          <p className="text-sm text-on-surface-variant">Real-time purity status across all locations</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-surface-variant text-on-surface-variant rounded-full text-sm font-medium hover:bg-surface-variant/80 transition-colors">
            Filter by Region
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Add Branch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Map View */}
        <div className="col-span-12 lg:col-span-8">
          <div className="m3-card h-[600px] relative overflow-hidden bg-surface-variant/10 border border-outline-variant/20 rounded-2xl z-0">
            <MapContainer
              center={[19.0760, 72.8777]}
              zoom={9}
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%', borderRadius: '16px' }}
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                attribution='&copy; Google Maps'
              />
              {BRANCHES.map((branch) => (
                <Marker
                  key={branch.id}
                  position={[branch.lat, branch.lng]}
                  icon={createCustomIcon(branch.color)}
                >
                  <Popup className="custom-popup">
                    <div className="p-2">
                      <h3 className="font-bold text-sm">{branch.name}</h3>
                      <p className="text-xs">Status: {branch.status}</p>
                      <p className="text-xs">Purity: {branch.purity}%</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Sidebar List */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {BRANCHES.map((branch) => (
            <div key={branch.id} className="m3-card p-4 hover:bg-surface-variant/20 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${branch.purity >= 95 ? 'bg-primary-container text-on-primary-container' :
                      branch.purity >= 90 ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-on-surface">{branch.name}</h3>
                    <p className="text-xs text-on-surface-variant">{branch.status}</p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${branch.purity >= 95 ? 'text-primary' :
                    branch.purity >= 90 ? 'text-secondary' : 'text-error'
                  }`}>
                  {branch.purity}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/20">
                <span className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> +2.4% this week
                </span>
                <button className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
