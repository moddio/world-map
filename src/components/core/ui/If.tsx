import { useMemo } from 'react';

export default function If({ condition, fallback, children }) {
  return useMemo(() => {
    if (condition) {
      if (typeof children === 'function') {
        return <>{children(condition)}</>;
      }

      return <>{children}</>;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return null;
  }, [condition, fallback, children]);
}
