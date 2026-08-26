/**
 * Mobile Haptics Engine (Web Vibration API)
 * Delivers native-feeling tactile feedback on supported iOS/Android devices.
 */

export const hapticLight = () => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(8);
    } catch {
      // Ignore vibration errors on unsupported devices
    }
  }
};

export const hapticMedium = () => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(15);
    } catch {
      // Ignore
    }
  }
};

export const hapticSuccess = () => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([10, 30, 20]);
    } catch {
      // Ignore
    }
  }
};

export const hapticSelection = () => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(5);
    } catch {
      // Ignore
    }
  }
};

export const hapticWarning = () => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([20, 50, 20]);
    } catch {
      // Ignore
    }
  }
};

export const hapticError = () => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate([30, 40, 30, 40, 50]);
    } catch {
      // Ignore
    }
  }
};

