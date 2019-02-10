import { useRef } from "react";

export default function useInitializedRef<T>(initializer: () => T): () => T {
  const ref = useRef(null);

  return () => {
    if (ref.current == null) {
      ref.current = initializer();
    }
    return ref.current;
  };
}
