import { numberStatsGenerator } from '@lineup-lite/components';

export const arr = Array(100)
  .fill(0)
  .map(() => Math.random());
const gen = numberStatsGenerator();
export const stats = gen(arr);
export const filtered = numberStatsGenerator({ min: stats.min, max: stats.max, numberOfBins: stats.hist.length })(
  arr.slice(0, 50)
);
