import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False during server render and hydration, true once on the client. */
export function useMount() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return { mounted };
}
