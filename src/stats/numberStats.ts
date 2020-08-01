import boxplot, { BoxplotStatsOptions, IBoxPlot } from '@sgratzl/boxplots';
import { defaultConstantColorScale } from '../renderers/defaults';
import { normalize } from './scale';

/**
 * computes the optimal number of bins for a given array length
 * @param {number} length
 * @returns {number}
 */
export function getNumberOfBins(length: number) {
    if (length === 0) {
        return 1;
    }
    // as by default used in d3 the Sturges' formula
    return Math.ceil(Math.log(length) / Math.LN2) + 1;
}

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
    format?: Intl.NumberFormatOptions;
    min?: number;
    max?: number;
}

function createHist(b: IBoxPlot, min: number, max: number, color: (v: number) => string) {
    const hist: INumberBin[] = [];
    const bins = getNumberOfBins(b.count);
    const binWidth = (max - min) / bins;
    let bin: INumberBin = {
        count: 0,
        x0: min,
        x1: min + binWidth,
        color: color(b.min + binWidth / 2)
    }
    hist.push(bin);
    // sorted
    for (let i = 0; i < b.items.length; i++) {
        const v = b.items[i];
        if (v < bin.x1 || hist.length >= bins) {
            bin.count++;
            continue;
        }
        // need a new bin
        bin = {
            count: 0,
            x0: bin.x1,
            x1: bin.x1 + binWidth,
            color: color(bin.x1 + binWidth / 2)
        }
        hist.push(bin);
    }
    // ensure last x1 is the max
    bin.x1 = max;
    return hist;
}

export function numberStats(options: NumberStatsOptions = {}) {
    const color = options.color ?? defaultConstantColorScale;
    const format = new Intl.NumberFormat(options.locales, options.format);

    return (arr: readonly number[] | Float32Array | Float64Array): INumberStats => {
        const b = boxplot(arr, options);
        const min = options.min ?? b.min;
        const max = options.max ?? b.max;
        const hist: INumberBin[] = createHist(b, min, max, color);
        return Object.assign(b, {
            min, max,
            hist,
            maxBin: hist.reduce((acc, b) => Math.max(acc, b.count), 0),
            scale: normalize(min, max),
            format: format.format.bind(format),
            color,
        });
    }
}
