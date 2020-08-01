import { interpolateBlues } from "d3-scale-chromatic";

export function defaultScale(v: number) {
    return Math.max(Math.min(v, 1), 0);
}

export function defaultConstantColorScale() {
    return 'rgba(0,0,255,0.25)';
}

export const defaultColorScale = interpolateBlues;