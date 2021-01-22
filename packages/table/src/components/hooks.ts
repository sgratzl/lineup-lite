import { useMemo } from 'react';
import type { CustomizeLineUpProps } from './interfaces';

export function useCustomize(props: CustomizeLineUpProps): CustomizeLineUpProps {
  return useMemo(
    () => ({
      styles: props.styles,
      classNames: props.classNames,
    }),
    [props.styles, props.classNames]
  );
}
