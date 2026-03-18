import { useRef } from 'react';

export function useLongPress(onLongPress, ms = 800) {
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(50);
      onLongPress();
    }, ms);
  };

  const cancel = () => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onPointerLeave: cancel,
  };
}
