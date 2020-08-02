export function normalize(min: number, max: number) {
  const range = max - min;
  return (v: number) => (range === 0 ? 0.5 : (v - min) / range);
}

export function deNormalize(min: number, max: number) {
  const range = max - min;
  return (v: number) => v * range + min;
}
