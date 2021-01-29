import { useEffect, useMemo } from 'react';
import type { TableInstance } from 'react-table';
import type { CustomizeLineUpProps } from './interfaces';
import type { LineUpLiteContextProps } from './contexts';

export function useLineUpLiteContext<D extends object>(
  props: CustomizeLineUpProps & { dark?: boolean; onStateChange?: (state: any) => void },
  instance: TableInstance<D>
): LineUpLiteContextProps {
  const { styles = {}, classNames = {}, dark = false, onStateChange } = props;
  const { dispatch, state } = instance;

  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [onStateChange, state]);

  const sortByColumnCount = (state as any).sortBy?.length ?? 0;
  const groupByColumnCount = (state as any).groupBy?.length ?? 0;

  return useMemo(
    () => ({
      styles,
      classNames,
      dispatch,
      dark,
      sortByColumnCount,
      groupByColumnCount,
    }),
    [styles, classNames, dispatch, dark, sortByColumnCount, groupByColumnCount]
  );
}
