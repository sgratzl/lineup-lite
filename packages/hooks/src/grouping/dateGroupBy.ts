/**
 * @lineup-lite/hooks
 * https://github.com/sgratzl/lineup-lite
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ColumnInstance, Row } from 'react-table';
import {
  format,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfQuarter,
  startOfSecond,
  getDayOfYear,
  startOfWeek,
  getWeek,
  getQuarter,
} from 'date-fns';
import type { UnknownObject } from '../interfaces';
import { histGroupBy, MISSING_GROUP } from './histGroupBy';
import type { AnyObject } from '../types';

export declare type DateGroupByGranularity =
  | 'century'
  | 'decade'
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day_of_week'
  | 'day_of_month'
  | 'day_of_year'
  | 'hour'
  | 'minute'
  | 'second';

export interface DateGroupByOptions {
  /**
   * granularity level for the grouping
   */
  granularity: DateGroupByGranularity;
  /**
   * whether circular occurrences should be in the same bin
   * e.g. granularity = month
   * circular: 01.2018 == 01.2017
   * not circular: 01.2018 != 01.2017
   */
  circular: boolean;
}

function padLeft(v: number | string, size = 2) {
  const s = String(v);
  if (s.length >= size) {
    return s;
  }
  if (typeof s.padStart === 'function') {
    return s.padStart(size, '0');
  }
  const rest = size - s.length;
  if (rest === 1) {
    return `0${s}`;
  }
  if (rest === 2) {
    return `00${s}`;
  }
  return `${Array(rest).fill('0').join()}${s}`;
}

function toGroup(value: Date | null, grouper: DateGroupByOptions): { name: string; value: number } {
  if (value == null) {
    return { name: MISSING_GROUP, value: Number.NaN };
  }
  switch (grouper.granularity) {
    case 'century': {
      const centuryP = Math.floor(value.getFullYear() / 100);
      if (grouper.circular) {
        const century = centuryP % 10;
        return {
          value: century,
          name: `*${century}00`,
        };
      }
      return {
        value: centuryP,
        name: `${centuryP}00`,
      };
    }
    case 'decade': {
      const decadeP = Math.floor(value.getFullYear() / 10);
      if (grouper.circular) {
        const decade = decadeP % 10;
        return {
          value: decade,
          name: `**${decade}0`,
        };
      }
      return {
        value: decadeP,
        name: `${decadeP}0`,
      };
    }
    case 'year':
      if (grouper.circular) {
        const year = value.getFullYear() % 10;
        return {
          value: year,
          name: `***${year}`,
        };
      }
      return {
        value: value.getFullYear(),
        name: format(value, 'yyyy'),
      };
    case 'quarter':
      if (grouper.circular) {
        return {
          value: getQuarter(value),
          name: format(value, 'qqq'),
        };
      }
      return {
        value: startOfQuarter(value).getTime(),
        name: format(value, 'yyyy qqq'),
      };
    case 'month':
      if (grouper.circular) {
        return {
          value: value.getMonth(),
          name: format(value, 'LLLL'),
        };
      }
      return {
        value: startOfMonth(value).getTime(),
        name: format(value, 'yyyy LLLL'),
      };
    case 'week':
      if (grouper.circular) {
        return {
          value: getWeek(value),
          name: format(value, 'ww'),
        };
      }
      return {
        value: startOfWeek(value).getTime(),
        name: format(value, 'yyyy ww'),
      };
    case 'day_of_week': {
      if (grouper.circular) {
        return {
          value: value.getDay(),
          name: format(value, 'cccc'),
        };
      }
      const s = startOfDay(value);
      return {
        value: s.getTime(),
        name: format(s, 'PPP'),
      };
    }
    case 'day_of_month': {
      if (grouper.circular) {
        return {
          value: value.getDate(),
          name: padLeft(value.getDate()),
        };
      }
      const s = startOfDay(value);
      return {
        value: s.getTime(),
        name: format(s, 'PPP'),
      };
    }
    case 'day_of_year': {
      if (grouper.circular) {
        // %j = day of year
        const v = getDayOfYear(value);
        return {
          value: v,
          name: format(value, 'DDD'),
        };
      }
      const s = startOfDay(value);
      return {
        value: s.getTime(),
        name: format(s, 'PPP'),
      };
    }
    case 'hour': {
      if (grouper.circular) {
        return {
          value: value.getHours(),
          name: padLeft(value.getHours(), 2),
        };
      }
      const s = startOfHour(value);
      return {
        value: s.getTime(),
        name: format(s, 'PPpp'),
      };
    }
    case 'minute': {
      if (grouper.circular) {
        return {
          value: value.getMinutes(),
          name: padLeft(value.getMinutes()),
        };
      }
      const s = startOfMinute(value);
      return {
        value: s.getTime(),
        name: format(s, 'PPpp'),
      };
    }
    default: {
      if (grouper.circular) {
        return {
          value: value.getSeconds(),
          name: padLeft(value.getSeconds()),
        };
      }
      const s = startOfSecond(value);
      return {
        value: s.getTime(),
        name: format(s, 'PPpp'),
      };
    }
  }
}

export default function dateGroupBy<D extends AnyObject = UnknownObject>(
  rows: readonly Row<D>[],
  column: ColumnInstance<D>,
  options?: DateGroupByOptions
): Record<string, Row<D>[]> {
  if (!options) {
    return histGroupBy<D, Date>(rows, column);
  }
  const map = new Map<string, { rows: Row<D>[]; name: string; value: number }>();
  for (const row of rows) {
    const v = (row.values[column.id] as Date) ?? null;
    const group = toGroup(v, options);
    const entry = map.get(group.name);
    if (entry) {
      entry.rows.push(row);
    } else {
      map.set(group.name, { rows: [row], ...group });
    }
  }
  const r: Record<string, Row<D>[]> = {};
  Array.from(map.values())
    .sort((a, b) => {
      if (a.name === MISSING_GROUP) {
        return b.name === MISSING_GROUP ? 0 : 1;
      }
      if (b.name === MISSING_GROUP) {
        return -1;
      }
      return a.value - b.value;
    })
    .forEach((entry) => {
      r[entry.name] = entry.rows;
    });
  return r;
}

export function dateGroupByFactory<D extends AnyObject = UnknownObject>(
  options: DateGroupByOptions
): (rows: readonly Row<D>[], column: ColumnInstance<D>, options?: DateGroupByOptions) => Record<string, Row<D>[]> {
  return (rows, column, o?: DateGroupByOptions) => dateGroupBy<D>(rows, column, o ?? options);
}
