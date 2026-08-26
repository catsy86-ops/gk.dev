import { useUser as useClerkUser, useAuth as useClerkAuth, useClerk as useClerkClient } from "@clerk/clerk-react";

/**
 * Safe Clerk hooks that never throw runtime exceptions even if Clerk is blocked,
 * missing publishable key, or run in offline/restricted environments.
 */

export function useSafeUser() {
  try {
    return useClerkUser();
  } catch {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: null,
    };
  }
}

export function useSafeAuth() {
  try {
    return useClerkAuth();
  } catch {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionId: null,
      getToken: async () => null,
      signOut: async () => {},
    };
  }
}

export function useSafeClerk() {
  try {
    return useClerkClient();
  } catch {
    return {
      openSignIn: () => {},
      openSignUp: () => {},
      signOut: async () => {},
    };
  }
}
