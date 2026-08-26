---
name: threejs-webgl-optimizer
description: >-
  Optymalizuje renderowanie WebGL i Three.js w projekcie GK.dev (StatsSection).
  Zapobiega wyciekom pamięci GPU poprzez prawidłowe zwalnianie zasobów (geometry,
  material, texture dispose), zapewnia płynność 60 FPS, adaptacyjne zarządzanie
  pixelRatio oraz bezpieczne fallbacki na słabszych urządzeniach mobilnych.
---

# Three.js & WebGL Performance Optimizer (`threejs-webgl-optimizer`)

Ten skill definiuje standardy inżynierii grafiki 3D oraz optymalizacji WebGL w aplikacji **GK.dev** (ze szczególnym uwzględnieniem komponentu `StatsSection.tsx`).

---

## 1. Zasady Zarządzania Pamięcią GPU (Zero Memory Leaks)

1. **Czyszczenie Zasobów przy Unmount (`dispose()`)**:
   * Każda geometria (`BufferGeometry`), materiał (`Material`) i tekstura (`Texture`) musi być jawnie zwolniona w funkcji cleanupu `useEffect` lub `onUnmount`:
     ```ts
     geometry.dispose();
     material.dispose();
     texture.dispose();
     renderer.dispose();
     ```
2. **Usuwanie Event Listenerów**:
   * Zdarzenia `resize`, `mousemove`, `scroll` oraz pętle `requestAnimationFrame` (`cancelAnimationFrame(reqId)`) muszą być bezwzględnie anulowane.

---

## 2. Optymalizacja Wydajności i FPS

1. **Ograniczenie `pixelRatio`**:
   * Zawsze ograniczaj `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`. Wartości powyżej `2.0` drastycznie obciążają mobilne układy GPU bez widocznej poprawy jakości.
2. **Pauza Renderowania poza Ekranem (IntersectionObserver)**:
   * Pętla renderowania Three.js powinna działać **tylko wtedy**, gdy sekcja 3D znajduje się w widocznym viewport (`IntersectionObserver.isIntersecting === true`).
   * Gdy użytkownik przewinie stronę poza sekcję, zatrzymaj `requestAnimationFrame`.
3. **Adaptacyjny Fallback na Wolnych Łączach i Urządzeniach**:
   * Używaj `isSlowConnection()` z `@/lib/utils` do lazy-loadingu lub wyłączania ciężkich animacji na łączach 2G/3G i w trybie oszczędzania energii.
