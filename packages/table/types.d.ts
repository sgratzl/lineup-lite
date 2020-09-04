import { IColumnDesc, IDeriveOptions } from 'lineupjs';

declare module 'lineupjs/src/provider/utils' {
  export function deriveColumnDescriptions(data: any[], options?: Partial<IDeriveOptions>): IColumnDesc[];
}
