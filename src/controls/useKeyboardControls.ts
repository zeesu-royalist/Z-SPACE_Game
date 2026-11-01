import { useEffect, useRef } from 'react';

export interface MovementKeys {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
}

/**
 * Custom hook to capture keyboard inputs:
 * - Movement: WASD and Arrow keys
 * - Interaction: E key
 * Uses refs to prevent unnecessary React re-renders every key stroke.
 */
export function useKeyboardControls() {
  const keysRef = useRef<MovementKeys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    interact: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'w' || key === 'arrowup') {
        keysRef.current.forward = true;
      } else if (key === 's' || key === 'arrowdown') {
        keysRef.current.backward = true;
      } else if (key === 'a' || key === 'arrowleft') {
        keysRef.current.left = true;
      } else if (key === 'd' || key === 'arrowright') {
        keysRef.current.right = true;
      } else if (key === 'e') {
        keysRef.current.interact = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'w' || key === 'arrowup') {
        keysRef.current.forward = false;
      } else if (key === 's' || key === 'arrowdown') {
        keysRef.current.backward = false;
      } else if (key === 'a' || key === 'arrowleft') {
        keysRef.current.left = false;
      } else if (key === 'd' || key === 'arrowright') {
        keysRef.current.right = false;
      } else if (key === 'e') {
        keysRef.current.interact = false;
      }
    };

    // Reset keys if window loses focus
    const handleBlur = () => {
      keysRef.current.forward = false;
      keysRef.current.backward = false;
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.interact = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return keysRef;
}
