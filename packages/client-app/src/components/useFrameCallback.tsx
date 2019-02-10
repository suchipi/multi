import React, { useRef, useEffect, useContext } from "react";

const FrameContext = React.createContext<Set<(number) => any> | null>(null);

export function FrameProvider({ children }: { children: React.ReactNode }) {
  const setRef = useRef(new Set());
  const lastTimeRef = useRef(null);

  useEffect(() => {
    function onFrame(currentTime) {
      const set = setRef.current;
      const lastTime = lastTimeRef.current;
      const setLastTime = (value) => (lastTimeRef.current = value);

      if (lastTime == null) {
        setLastTime(currentTime);
        requestAnimationFrame(onFrame);
        return;
      }
      const elapsedTime = currentTime - lastTime;
      setLastTime(currentTime);

      set.forEach((callback) => {
        try {
          callback(elapsedTime);
        } catch (err) {
          console.error(err);
        }
      });

      requestAnimationFrame(onFrame);
    }

    requestAnimationFrame(onFrame);
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
