/**
 * @lineup-lite/app
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export function loadJSON<T>(url: string): Promise<T> {
  return fetch(`https://cors-anywhere.herokuapp.com/${url}`).then((r) => r.json());
}

export default function loadFile<T>(file: File) {
  return new Promise<T>((resolve, reject) => {
    const r = new FileReader();
    r.addEventListener('load', () => {
      const data = JSON.parse(r.result as string);
      resolve(data);
    });
    r.addEventListener('error', () => {
      reject(r.error);
    });
    r.readAsText(file);
  });
}
