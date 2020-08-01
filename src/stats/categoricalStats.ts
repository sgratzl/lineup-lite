import { defaultCategoricalColorScale } from "../renderers/defaults";

export interface ICategoricalBin {
    value: string;
    count: number;
    color: string;
}

export interface ICategoricalStats {
    hist: readonly ICategoricalBin[];
    maxBin: number;

    missing: number;
    count: number;

    color: ((v: string) => string);
}

export interface CategoricalStatsOptions {
    color?: ((v: string) => string);
}

export function categoricalStats(options: CategoricalStatsOptions = {}) {
    const color = options.color ?? defaultCategoricalColorScale();

    return (arr: readonly string[]): ICategoricalStats => {
        let missing = 0;
        const map = new Map<string, number>();
        for (const v of arr) {
            if (v == null) {
                missing++;
                continue;
            }
            map.set(v, 1 + (map.get(v) ?? 0));
        }
        const hist = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([value, count]) => ({
            value, count,
            color: color(value)
        }));
        return {
            hist,
            maxBin: hist.reduce((acc, b) => Math.max(acc, b.count), 0),
            color,
            missing,
            count: arr.length
        }
    }
}