import React from 'react';

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }
>(function IndeterminateCheckbox({ indeterminate, ...rest }, ref) {
  const defaultRef = React.useRef<HTMLInputElement>(null);
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    (resolvedRef as React.RefObject<HTMLInputElement>).current!.indeterminate = indeterminate ?? false;
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});

export default IndeterminateCheckbox;
