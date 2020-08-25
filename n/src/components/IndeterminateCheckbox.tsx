import React from 'react';

export default React.forwardRef<HTMLInputElement, React.HTMLAttributes<HTMLInputElement> & { indeterminate?: boolean }>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>(null);
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      (resolvedRef as React.RefObject<HTMLInputElement>).current!.indeterminate = indeterminate ?? false;
    }, [resolvedRef, indeterminate]);

    return <input type="checkbox" ref={resolvedRef} {...rest} />;
  }
);
