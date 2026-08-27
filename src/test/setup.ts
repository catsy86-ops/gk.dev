import React from "react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

const observedElements: Map<Element, IntersectionObserverEntry> = new Map();
let activeCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "0px";
  readonly thresholds: ReadonlyArray<number> = [0];

  constructor(private callback: IntersectionObserverCallback) {
    activeCallback = callback;
  }

  observe(target: Element) {
    const entry: IntersectionObserverEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      target,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    };
    observedElements.set(target, entry);
    try {
      this.callback([entry], this);
    } catch {
      // ignore
    }
  }

  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
});

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: MockResizeObserver,
});

export function triggerIntersection(entries: { target: Element; isIntersecting: boolean; intersectionRatio: number }[]) {
  if (activeCallback) {
    activeCallback(
      entries.map((e) => ({
        ...e,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: null,
        time: Date.now(),
      })),
      new MockIntersectionObserver(() => {}),
    );
  }
}

// Mock Canvas getContext for JSDOM
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation((contextId: string) => {
    if (contextId === "2d") {
      return {
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        scale: vi.fn(),
        setTransform: vi.fn(),
        resetTransform: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        ellipse: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        bezierCurveTo: vi.fn(),
        quadraticCurveTo: vi.fn(),
        closePath: vi.fn(),
        drawImage: vi.fn(),
        getImageData: vi.fn(),
        fillText: vi.fn(),
        strokeText: vi.fn(),
        measureText: vi.fn().mockReturnValue({ width: 12 }),
        createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
        createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
        canvas: { width: 800, height: 600 },
        globalAlpha: 1,
        fillStyle: "#000",
        strokeStyle: "#000",
        lineWidth: 1,
        font: "",
        textBaseline: "alphabetic",
      };
    }
    return null;
  });
}

// Mock Clerk React
vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: ({ children }: { children: React.ReactNode }) => children,
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignUpButton: ({ children }: { children: React.ReactNode }) => children,
  SignIn: () => React.createElement("div", { "data-testid": "clerk-signin" }, "Clerk SignIn Form"),
  SignUp: () => React.createElement("div", { "data-testid": "clerk-signup" }, "Clerk SignUp Form"),
  UserButton: () => React.createElement("button", { "aria-label": "Profil użytkownika" }, "User Avatar"),
  UserProfile: () => React.createElement("div", null, "User Profile Modal"),
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: "user_test_123",
      fullName: "Grzegorz Tester",
      primaryEmailAddress: { emailAddress: "kontakt@gkdev.pl" },
    },
  }),
  useAuth: () => ({
    isSignedIn: true,
    userId: "user_test_123",
    getToken: vi.fn().mockResolvedValue("mock_jwt_token"),
  }),
  useClerk: () => ({
    openSignIn: vi.fn(),
    openSignUp: vi.fn(),
    signOut: vi.fn(),
  }),
}));

