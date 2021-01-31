export interface Row {
  name: string;
  shirtSize: 'S' | 'M' | 'L';
  hobbies: ('running' | 'cooking' | 'reading')[];
}

export const data: Row[] = [
  {
    name: 'Panchito Green',
    shirtSize: 'S',
    hobbies: ['running', 'cooking'],
  },
  {
    name: 'Rubia Robker',
    shirtSize: 'M',
    hobbies: ['cooking'],
  },
  {
    name: 'Micheil Sappell',
    shirtSize: 'L',
    hobbies: ['running', 'cooking', 'reading'],
  },
  {
    name: 'Geoffrey Sprason',
    shirtSize: 'M',
    hobbies: ['running', 'reading'],
  },
  {
    name: 'Grissel Rounsefull',
    shirtSize: 'S',
    hobbies: ['reading'],
  },
];
