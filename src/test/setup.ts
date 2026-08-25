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
    observedElements.set(target, {
      isIntersecting: true,
      intersectionRatio: 1,
      target,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    });
  }

  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: MockIntersectionObserver,
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
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        closePath: vi.fn(),
        createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
        createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
        canvas: { width: 800, height: 600 },
        globalAlpha: 1,
        fillStyle: "#000",
        strokeStyle: "#000",
        lineWidth: 1,
      };
    }
    return null;
  });
}

