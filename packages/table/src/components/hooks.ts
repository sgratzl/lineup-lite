import { useMemo } from 'react';
import type { ICustomizeLineUpProps } from './interfaces';

export function useCustomize(props: ICustomizeLineUpProps): ICustomizeLineUpProps {
  return useMemo(
    () => ({
      styles: props.styles,
      classNames: props.classNames,
    }),
    [props.styles, props.classNames]
  );
}
