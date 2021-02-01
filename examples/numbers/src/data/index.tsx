export interface Row {
  name: string;
  shirtSize: 'S' | 'M' | 'L';
  runningTimes: number[];
}

export const data: Row[] = [
  {
    name: 'Panchito Green',
    shirtSize: 'S',
    runningTimes: [10, 20, 40, 30, 15],
  },
  {
    name: 'Rubia Robker',
    shirtSize: 'M',
    runningTimes: [21, 39, 25, 42, 18],
  },
  {
    name: 'Micheil Sappell',
    shirtSize: 'L',
    runningTimes: [16, 44, 30, 32, 31],
  },
  {
    name: 'Geoffrey Sprason',
    shirtSize: 'M',
    runningTimes: [39, 50, 43, 32, 24],
  },
  {
    name: 'Grissel Rounsefull',
    shirtSize: 'S',
    runningTimes: [36, 19, 37, 38, 17],
  },
];
