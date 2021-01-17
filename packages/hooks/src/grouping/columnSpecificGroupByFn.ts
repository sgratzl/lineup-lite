import { Row, IdType, defaultGroupByFn } from 'react-table';

export function columnSpecificGroupByFn<D extends object = {}>(
  rows: Row<D>[],
  columnId: IdType<D>
): Record<string, Row<D>[]> {
  if (rows.length === 0 || rows[0] == null || rows[0].allCells == null) {
    return {};
  }
  const column = rows[0].allCells.find((d) => d.column.id === columnId);
  if (column && typeof (column.column as any).groupBy) {
    return (column.column as any).groupBy(rows, column.column);
  }
  return defaultGroupByFn(rows, columnId);
}

// return rows.reduce((prev, row) => {
//   // TODO: Might want to implement a key serializer here so
//   // irregular column values can still be grouped if needed?
//   const resKey = `${row.values[columnId]}`;
//   prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : ([] as Row<D>[]);
//   prev[resKey].push(row);
//   return prev;
// }, {} as Record<string, Row<D>[]>);
