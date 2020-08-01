import { interpolateBlues, schemeCategory10 } from "d3-scale-chromatic";

export function defaultScale(v: number) {
    return Math.max(Math.min(v, 1), 0);
}

export function defaultConstantColorScale() {
    return 'rgba(0,0,255,0.25)';
}

export const defaultColorScale = interpolateBlues;


export function autoAssignColors(colors: readonly string[]) {
    let i = 0;
    const map = new Map<string, string>();
    return (c: string) => {
        if (map.has(c)) {
            return map.get(c)!;
        }
        const color = colors[(i++) % colors.length];
        map.set(c, color);
        return color;
    }
}

export function defaultCategoricalColorScale() {
    return autoAssignColors(schemeCategory10);
}