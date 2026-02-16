const KAABA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262,
};

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI;
}

export function getQiblaBearing(latitude: number, longitude: number) {
  const latRad = degreesToRadians(latitude);
  const kaabaLatRad = degreesToRadians(KAABA_COORDINATES.latitude);
  const deltaLon = degreesToRadians(KAABA_COORDINATES.longitude - longitude);

  const y = Math.sin(deltaLon);
  const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(deltaLon);

  const angle = radiansToDegrees(Math.atan2(y, x));
  return (angle + 360) % 360;
}
