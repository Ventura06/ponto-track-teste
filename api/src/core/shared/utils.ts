export function generateLatitude() {
  const min = -90;
  const max = 90;
  return (Math.random() * (max - min) + min).toFixed(6);
}

export function generateLongitude() {
  const min = -180;
  const max = 180;
  return (Math.random() * (max - min) + min).toFixed(6);
}
