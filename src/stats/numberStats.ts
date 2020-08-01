import boxplot, { BoxplotStatsOptions, IBoxPlot } from '@sgratzl/boxplots';
import { defaultConstantColorScale } from '../renderers/defaults';
import { normalize } from './scale';

export interface INumberBin {
    count: number;
    color: string;
    x0: number;
    x1: number;
}

export interface INumberStats extends IBoxPlot {
    hist: readonly INumberBin[];
    maxBin: number;

    scale: (v: number) => number;
    color: (v: number) => string;
    format: (v: number) => string;
}

export interface NumberStatsOptions extends BoxplotStatsOptions {
    color?: (v: number) => string;
    locales?: string | string[];
    format?: Intl.NumberFormatOptions
}

export function numberStats(options: NumberStatsOptions = {}) {
    const color = options.color ?? defaultConstantColorScale;
    const format = new Intl.NumberFormat(options.locales, options.format);

    return (arr: readonly number[] | Float32Array | Float64Array): INumberStats => {
        const b = boxplot(arr, options);
        const hist: INumberBin[] = [];
        // TODO
        return Object.assign(b, {
            hist,
            maxBin: hist.reduce((acc, b) => Math.max(acc, b.count), 0),
            scale: normalize(b.min, b.max),
            format: format.format.bind(format),
            color,
        });
    }
}