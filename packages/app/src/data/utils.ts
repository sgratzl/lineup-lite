export function deriveDataSetName(file: File | string) {
  let name: string = '';
  if (typeof file === 'string') {
    // url
    name = file.includes('/') ? file.slice(file.lastIndexOf('/') + 1) : file;
  } else {
    name = file.name;
  }
  return name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name;
}
