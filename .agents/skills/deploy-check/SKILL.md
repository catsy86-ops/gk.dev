---

    name: deploy-check
    description: Uruchamia pełną weryfikację jakościową przed wdrożeniem (lint, testy, build).
    ---

    # Instrukcja wdrożeniowa

    1. Uruchom `npm run lint` i upewnij się, że nie ma błędów.
    2. Wykonaj `npm run test` (wszystkie testy muszą przejść).
    3. Zbuduj aplikację `npm run build` i sprawdź rozmiary chunków w `dist/`.
