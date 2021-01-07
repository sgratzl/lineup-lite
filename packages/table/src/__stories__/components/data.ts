import { numberStatsGenerator, categoricalStatsGenerator, dateStatsGenerator } from '@lineup-lite/components';

export const number = (() => {
  const arr = Array(100)
    .fill(0)
    .map(() => Math.random());
  const gen = numberStatsGenerator();

  const stats = gen(arr);
  const filterGen = numberStatsGenerator({ min: stats.min, max: stats.max, numberOfBins: stats.hist.length });
  const filtered = filterGen(arr.slice(0, 50));

  const filter2 = [0.2, 0.8] as [number, number];
  const filtered2 = filterGen(arr.filter((d) => d > filter2[0] && d < filter2[1]));

  return { arr, stats, filtered, filter2, filtered2 };
})();

export const categorical = (() => {
  const categories = ['c1', 'c2', 'c3'];
  const arr = Array(100)
    .fill(0)
    .map(() => categories[Math.min(Math.floor(Math.random() * (categories.length + 1)), categories.length - 1)]);
  const gen = categoricalStatsGenerator({ categories });

  const stats = gen(arr);
  const filtered = categoricalStatsGenerator({ categories })(arr.slice(0, 50));

  return { arr, stats, filtered };
})();

export const date = (() => {
  const start = new Date(2020, 0, 1);
  const end = new Date(2021, 0, 1);
  const factor = end.valueOf() - start.valueOf();

  const arr = Array(100)
    .fill(0)
    .map(() => new Date(start.valueOf() + Math.floor(factor * Math.random())));
  const gen = dateStatsGenerator();

  const stats = gen(arr);
  const filterGen = dateStatsGenerator({ min: stats.min, max: stats.max, histGranularity: stats.histGranularity });
  const filtered = filterGen(arr.slice(0, 50));

  const filter2 = [new Date(2020, 4, 1), new Date(2020, 9, 1)] as [Date, Date];
  const filtered2 = filterGen(arr.filter((d) => d > filter2[0] && d < filter2[1]));

  return { arr, stats, filtered, filter2, filtered2 };
})();

export function noop() {
  // noop
}
