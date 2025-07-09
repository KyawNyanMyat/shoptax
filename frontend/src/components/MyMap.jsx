import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const center = [20.4327371, 96.1355301];

const MyMap = () => {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>မြို့နယ် ဖွံ့ဖြိုးရေးဌာန</Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyMap;
