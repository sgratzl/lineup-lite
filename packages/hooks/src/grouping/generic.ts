import { Row, IdType } from 'react-table';

export function genericGroupByFn<D extends object = {}>(rows: Row<D>[], columnId: IdType<D>): Record<string, Row<D>[]> {
  return rows.reduce((prev, row) => {
    // TODO: Might want to implement a key serializer here so
    // irregular column values can still be grouped if needed?
    const resKey = `${row.values[columnId]}`;
    prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : ([] as Row<D>[]);
    prev[resKey].push(row);
    return prev;
  }, {} as Record<string, Row<D>[]>);
}
