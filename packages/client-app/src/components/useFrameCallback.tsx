import React, { useRef, useEffect, useContext } from "react";

type FrameCallbacksSet = Set<(number) => any>;

const FrameContext = React.createContext<FrameCallbacksSet | null>(null);

export function FrameProvider({ children }: { children: React.ReactNode }) {
  const setRef = useRef<FrameCallbacksSet>(new Set());
  const lastTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    function onFrame(currentTime: number) {
      const set = setRef.current;
      const lastTime = lastTimeRef.current;

      if (lastTime == null) {
        lastTimeRef.current = currentTime;
        requestRef.current = requestAnimationFrame(onFrame);
        return;
      }

      const elapsedTime = currentTime - lastTime;
      lastTimeRef.current = currentTime;

      set.forEach((callback) => {
        try {
          callback(elapsedTime);
        } catch (err) {
          console.error(err);
        }
      });

      requestRef.current = requestAnimationFrame(onFrame);
    }

    requestRef.current = requestAnimationFrame(onFrame);

    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <FrameContext.Provider value={setRef.current}>
      {children}
    </FrameContext.Provider>
  );
}

export default function useFrameCallback(
  callback: (elapsedTime: number) => any
) {
  const set = useContext(FrameContext);
  useEffect(() => {
    set.add(callback);

    return () => {
      set.delete(callback);
    };
  }, [callback]);
}
