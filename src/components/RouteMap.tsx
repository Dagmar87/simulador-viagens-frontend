import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';
import { latLngBounds } from 'leaflet';
import { useEffect } from 'react';
import type { LatLngTuple } from 'leaflet';

interface Geometry {
  type?: string;
  coordinates?: number[][];
}

interface Props {
  geometry: Geometry | null;
}

function FitRoute({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      map.fitBounds(latLngBounds(positions), {
        padding: [30, 30],
      });
    }
  }, [map, positions]);

  return null;
}

export default function RouteMap({ geometry }: Props) {
  const positions: LatLngTuple[] = (geometry?.coordinates ?? [])
    .filter(
      (coordinate) =>
        Array.isArray(coordinate) &&
        coordinate.length >= 2 &&
        Number.isFinite(coordinate[0]) &&
        Number.isFinite(coordinate[1]),
    )
    .map(([longitude, latitude]): LatLngTuple => [latitude, longitude]);

  if (positions.length === 0) {
    return (
      <div className="panel map-placeholder">
        <h3>Mapa indisponível</h3>
        <p>A API não retornou uma geometria de rota válida.</p>
      </div>
    );
  }

  return (
    <section className="panel map-panel">
      <div className="section-heading">
        <div>
          <h3>Mapa da rota</h3>
          <p>Trajeto retornado pelo serviço de roteamento.</p>
        </div>
      </div>

      <MapContainer
        center={positions[0]}
        zoom={6}
        scrollWheelZoom
        className="route-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={positions}
          pathOptions={{
            color: '#2563eb',
            weight: 5,
          }}
        />

        <FitRoute positions={positions} />
      </MapContainer>
    </section>
  );
}
