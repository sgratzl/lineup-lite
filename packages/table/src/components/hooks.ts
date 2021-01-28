import { useEffect, useMemo } from 'react';
import type { CustomizeLineUpProps, LineUpLiteProps } from './interfaces';

export function useCommonLineUp<D extends object>(props: LineUpLiteProps<D>, state: any): CustomizeLineUpProps {
  const shared = useMemo(
    () => ({
      styles: props.styles,
      classNames: props.classNames,
    }),
    [props.styles, props.classNames]
  );

  // call the callback when the internal state changes
  const { onStateChange } = props;
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [onStateChange, state]);

  return shared;
}
