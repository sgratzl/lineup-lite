/**
 * @lineup-lite/example-basic
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export interface Row {
  name: string | null;
  age: number | null;
  shirtSize: 'S' | 'M' | 'L' | null;
  hobbies: ('running' | 'cooking' | 'reading')[] | null;
  runningTimes: number[] | null;
}

export const data: Row[] = [
  {
    name: 'Panchito Green',
    age: 10,
    shirtSize: 'S',
    hobbies: ['running', 'cooking'],
    runningTimes: [10, 20, 40, 30, 15],
  },
  {
    name: 'Rubia Robker',
    age: 25,
    shirtSize: 'M',
    hobbies: ['cooking'],
    runningTimes: [21, 39, 25, 42, 18],
  },
  {
    name: 'Micheil Sappell',
    age: 50,
    shirtSize: 'L',
    hobbies: ['running', 'cooking', 'reading'],
    runningTimes: [16, 44, 30, 32, 31],
  },
  {
    name: 'Geoffrey Sprason',
    age: 30,
    shirtSize: 'M',
    hobbies: ['running', 'reading'],
    runningTimes: [39, 50, 43, 32, 24],
  },
  {
    name: 'Grissel Rounsefull',
    age: 21,
    shirtSize: 'S',
    hobbies: ['reading'],
    runningTimes: [36, 19, 37, 38, 17],
  },
  {
    name: null,
    age: null,
    shirtSize: null,
    hobbies: null,
    runningTimes: null,
  },
];
