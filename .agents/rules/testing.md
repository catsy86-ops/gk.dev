# Standardy Testowania w GK.dev

1. **Środowisko testowe**:
   - Vitest + JSDOM + `@testing-library/react` + `@testing-library/jest-dom`.
   - Wzorzec testów: `src/**/*.{test,spec}.{ts,tsx}`.

2. **Mockowanie w `src/test/setup.ts`**:
   - `window.matchMedia`
   - `IntersectionObserver`
   - `HTMLCanvasElement.prototype.getContext` (2D Canvas)
   - `@clerk/clerk-react`

3. **Zasady pisania testów**:
   - Każdy komponent UI musi posiadać test sprawdzający renderowanie, dostępność (`role`, `aria-label`) oraz obsługę zdarzeń (np. `fireEvent.click`).
   - Zmiany stanu wywoływane przez timery należy opakowywać w `act(() => { vi.advanceTimersByTime(...) })`.
   - Wszystkie 34+ pliki testowe muszą przechodzić z wynikiem 100% bez błędów i bez komunikatów na strumieniu `stderr`.
