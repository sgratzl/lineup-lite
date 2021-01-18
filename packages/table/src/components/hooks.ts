import { useMemo } from 'react';
import type { ISharedLineUpProps } from './interfaces';

export function useShared<D extends object>(props: ISharedLineUpProps<D>): ISharedLineUpProps<D> {
  return useMemo(
    () => ({
      styles: props.styles,
      classNames: props.classNames,
      icons: props.icons,
    }),
    [props.styles, props.classNames, props.icons]
  );
}
