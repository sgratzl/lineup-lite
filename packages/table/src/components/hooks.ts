import { useEffect, useMemo } from 'react';
import type { TableInstance } from 'react-table';
import type { CustomizeLineUpProps } from './interfaces';
import type { LineUpLiteContextProps } from './contexts';
import { LINEUP_LITE_I18N_EN } from '../i18n';

const EMPTY_OBJ = {}; // static object to avoid updates

export function useLineUpLiteContext<D extends object>(
  props: CustomizeLineUpProps & { dark?: boolean; onStateChange?: (state: any) => void },
  instance: TableInstance<D>
): LineUpLiteContextProps {
  const {
    styles = EMPTY_OBJ,
    classNames = EMPTY_OBJ,
    components = EMPTY_OBJ,
    dark = false,
    onStateChange,
    i18n = EMPTY_OBJ,
  } = props;
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
      components,
      i18n: {
        ...LINEUP_LITE_I18N_EN,
        ...(i18n ?? {}),
      },
      dispatch,
      dark,
      sortByColumnCount,
      groupByColumnCount,
    }),
    [styles, classNames, components, dispatch, dark, sortByColumnCount, groupByColumnCount, i18n]
  );
}
