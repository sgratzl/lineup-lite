

export function normalize(min: number, max: number) {
    const range = max - min;
    return (v: number) => (v - min) / range;
}