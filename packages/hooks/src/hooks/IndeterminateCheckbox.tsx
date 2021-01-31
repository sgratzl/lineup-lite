import React, { forwardRef, HTMLAttributes, RefObject, useEffect, useRef } from 'react';

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  HTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }
>(function IndeterminateCheckbox({ indeterminate, ...rest }, ref) {
  const defaultRef = useRef<HTMLInputElement>(null);
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    (resolvedRef as RefObject<HTMLInputElement>).current!.indeterminate = indeterminate ?? false;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

export default IndeterminateCheckbox;
