export interface CourseLesson {
  id: string;
  module: number;
  moduleName: string;
  title: string;
  shortDesc: string;
  level: "Początkujący" | "Średniozaawansowany" | "Zaawansowany";
  duration: string;
  source: {
    name: string;
    url: string;
    badge: string;
  };
  iconName: "Code2" | "Zap" | "Layers" | "Cpu" | "ShieldCheck" | "Award";
  theory: string[];
  keyPoints: string[];
  codeSnippet: string;
  codeExplanation: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const jsCourseLessons: CourseLesson[] = [
  {
    id: "es6-fundamentals",
    module: 1,
    moduleName: "Fundamenty & ES6+",
    title: "Nowoczesna Składnia: let/const, Arrow Functions & Destrukturyzacja",
    shortDesc: "Opanuj kluczowe elementy współczesnego JavaScriptu: zasięg blokowy, funkcje strzałkowe oraz ekspresowe wyciąganie danych z obiektów.",
    level: "Początkujący",
    duration: "8 min",
    iconName: "Zap",
    source: {
      name: "MDN Web Docs — JavaScript Guide",
      url: "https://developer.mozilla.org/pl/docs/Web/JavaScript/Guide/Grammar_and_types",
      badge: "MDN Official Guide",
    },
    theory: [
      "W nowoczesnym standardzie ECMAScript deklaracja zmiennych opiera się na słowach kluczowych 'const' (domyślny wybór dla wartości, których referencja się nie zmienia) oraz 'let' (dla zmiennych ze zmiennym stanem o zasięgu blokowym).",
      "Funkcje strzałkowe (Arrow Functions) zapewniają nie tylko zwięzłą składnię jedno-linijkową, ale przede wszystkim leksykalne wiązanie kontekstu 'this', eliminując klasyczne pułapki 'bind/apply'.",
      "Destrukturyzacja obiektów i tablic umożliwia czyste pobieranie zagnieżdżonych właściwości i ustawianie wartości domyślnych bez zbędnego kodu boilerplate.",
    ],
    keyPoints: [
      "Zawsze preferuj 'const', używaj 'let' tylko gdy zmienna musi być re-deklarowana.",
      "Arrow functions nie posiadają własnego 'this', 'arguments' ani 'prototype'.",
      "Destrukturyzacja wspiera aliasowanie: const { name: userName } = user;",
      "Operator Spread (...obj) tworzy płytką kopię (shallow copy) bez mutowania oryginału.",
    ],
    codeSnippet: `// 1. Zmienne o zasięgu blokowym & Template Literals
const developer = {
  name: "Grzegorz",
  role: "Fullstack Architect",
  skills: ["TypeScript", "React", "Node.js"]
};

// 2. Destrukturyzacja z wartością domyślną i aliasem
const { name, role, expYears = 6 } = developer;

// 3. Arrow Function & Spread Operator
const getDevSummary = (dev) => ({
  ...dev,
  status: "Available for projects",
  bio: \`\${dev.name} działa jako \${dev.role} z \${expYears}+ lat exp.\`
});

console.log(getDevSummary(developer));`,
    codeExplanation: "Kod demonstruje bezpieczną niemutowalną manipulację obiektami przy użyciu destrukturyzacji, operatora spread oraz szablonów literałów string (template literals).",
    quiz: {
      question: "Co stanie się przy próbie przypisania nowej wartości do zmiennej zadeklarowanej za pomocą 'const user = { name: 'Jan' }' w postaci 'user.name = 'Adam''?",
      options: [
        "Wyrzuci błąd TypeError: Assignment to constant variable.",
        "Wartość user.name zmieni się na 'Adam' bez błędu (zmienia się pole obiektu, a nie referencja).",
        "Wartość user.name zmieni się tylko w trybie 'sloppy mode', a w 'use strict' wyrzuci błąd.",
        "Obiekt zostanie automatycznie zamrożony (Object.freeze).",
      ],
      correctIndex: 1,
      explanation: "'const' zabezpiecza referencję zmiennej (nie pozwala przypisać user = innymObiekt), ale pola wewnątrz obiektu podlegają modyfikacji, chyba że użyjemy Object.freeze().",
    },
  },
  {
    id: "array-mastery",
    module: 2,
    moduleName: "Metody Tablic",
    title: "Potęga Metod Tablicowych: map, filter, reduce & find",
    shortDesc: "Funkcyjne przetwarzanie danych bez pętli 'for'. Dowiedz się jak transformować i agregować kolekcje w sposób deklaratywny i niemutowalny.",
    level: "Średniozaawansowany",
    duration: "10 min",
    iconName: "Layers",
    source: {
      name: "JavaScript.info — Array Methods",
      url: "https://javascript.info/array-methods",
      badge: "JavaScript.info Tutorial",
    },
    theory: [
      "Metody funkcyjne tablic w JavaScript eliminują potrzebę stosowania imperatywnych pętli 'for' i 'while', znacząco poprawiając czytelność i ułatwiając testowanie jednostkowe.",
      "Metoda '.map()' zwraca nową tablicę o identycznej długości, transformując każdy element zgodnie z funkcją zwrotną (callback).",
      "Metoda '.filter()' filtruje elementy spełniające warunek logiczny (zwracający true), pomijając pozostałe.",
      "Metoda '.reduce()' jest najpotężniejszym narzędziem agregacji danych — pozwala zredukować całą tablicę do dowolnego typu danych (liczba, obiekt słownikowy, kolejna tablica).",
    ],
    keyPoints: [
      "Metody .map(), .filter(), .reduce() nie mutują pierwotnej tablicy (zwracają nowy wynik).",
      "Do wyszukania pierwszego elementu spełniającego warunek użyj .find(), a do indeksu .findIndex().",
      "Metody .some() i .every() weryfikują warunki logiczne, zwracając boolean.",
      "Łączenie metod (method chaining: arr.filter().map().reduce()) tworzy czytelne potoki danych.",
    ],
    codeSnippet: `const projects = [
  { id: 1, name: "Przypominacz", budget: 12000, active: true },
  { id: 2, name: "E-Commerce", budget: 24000, active: true },
  { id: 3, name: "Landing MVP", budget: 4500, active: false }
];

// 1. Filtrowanie aktywnych projektów
const activeProjects = projects.filter(p => p.active);

// 2. Transformacja: wyciągnięcie nazw i przeliczenie waluty
const projectLabels = activeProjects.map(p => \`\${p.name} (EUR \${(p.budget / 4.3).toFixed(0)})\`);

// 3. Redukcja: suma całkowitego budżetu aktywnych wdrożeń
const totalRevenue = activeProjects.reduce((sum, p) => sum + p.budget, 0);

console.log("Aktywne etykiety:", projectLabels);
console.log("Łączny budżet aktywnych:", totalRevenue, "PLN");`,
    codeExplanation: "Przykładowy potok przetwarzania danych biznesowych: selekcja aktywnych rekordów, projekcja do widoku oraz obliczenie sumy sumującej za pomocą reduce.",
    quiz: {
      question: "Jaki wynik zwróci wywołanie [10, 20, 30].reduce((acc, curr) => acc + curr, 5)?",
      options: [
        "60",
        "65",
        "50",
        "NaN",
      ],
      correctIndex: 1,
      explanation: "Wartość początkowa akumulatora wynosi 5, do której dodajemy kolejno 10 (15), 20 (35) oraz 30, co w rezultacie daje 65.",
    },
  },
  {
    id: "async-promises",
    module: 3,
    moduleName: "Asynchroniczność",
    title: "Asynchroniczny JS: Event Loop, Promises & Async/Await",
    shortDesc: "Zrozumienie jednowątkowej asynchroniczności, mikro-zadań (microtasks) oraz bezbłędnej komunikacji z zewnętrznym API za pomocą Fetch i async/await.",
    level: "Średniozaawansowany",
    duration: "12 min",
    iconName: "Code2",
    source: {
      name: "MDN Web Docs — Asynchronous JavaScript",
      url: "https://developer.mozilla.org/pl/docs/Learn/JavaScript/Asynchronous",
      badge: "MDN Deep Dive",
    },
    theory: [
      "JavaScript działa w jednowątkowym środowisku (Single-Threaded), w którym pętla zdarzeń (Event Loop) koordynuje wykonywanie kodu synchronicznego ze stosem wywołań (Call Stack) oraz kolejkami zadań (Macrotask i Microtask Queue).",
      "Promises (obietnice) reprezentują stan przyszłej operacji asynchronicznej i mogą znajdować się w 1 z 3 stanów: Pending (oczekiwanie), Fulfilled (sukces), Rejected (błąd).",
      "Składnia 'async/await' to czytelny lukier składniowy (syntactic sugar) nad Promises, umożliwiający pisanie kodu asynchronicznego w sposób wyglądający jak kod sekwencyjny.",
    ],
    keyPoints: [
      "Operacje mikro-zadań (np. Promise.then, queueMicrotask) wykonują się PRZED kolejnym cyklem makro-zadań (setTimeout, setInterval).",
      "Zawsze otaczaj wywołania 'await' blokiem 'try...catch', aby zapobiec nieobsłużonym odrzuceniom (Unhandled Promise Rejections).",
      "Równoległe pobieranie zasobów realizuj przez Promise.all() lub Promise.allSettled() zamiast sekwencyjnych awaitów.",
    ],
    codeSnippet: `// 1. Asynchroniczna funkcja pobierająca dane telemetryczne
async function fetchSystemMetrics(endpoint) {
  try {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(\`Błąd HTTP: \${response.status}\`);
    }

    const data = await response.json();
    return { success: true, payload: data };
  } catch (error) {
    console.error("Błąd podczas pobierania danych:", error.message);
    return { success: false, error: error.message };
  }
}

// 2. Równoległe zapytania z Promise.all
async function loadDashboardData() {
  const [userData, analyticsData] = await Promise.all([
    fetchSystemMetrics("/api/user"),
    fetchSystemMetrics("/api/analytics")
  ]);
  console.log("Załadowano dane pulpitu:", { userData, analyticsData });
}`,
    codeExplanation: "Demonstracja bezpiecznej obsługi zapytań HTTP z walidacją response.ok, blokiem try-catch oraz równoległym wykonaniem zapytań przez Promise.all.",
    quiz: {
      question: "W jakiej kolejności zostanie wypisany tekst w konsoli dla kodu: console.log('1'); setTimeout(() => console.log('2'), 0); Promise.resolve().then(() => console.log('3')); console.log('4');?",
      options: [
        "1, 2, 3, 4",
        "1, 4, 3, 2",
        "1, 4, 2, 3",
        "1, 3, 4, 2",
      ],
      correctIndex: 1,
      explanation: "Kod synchroniczny (1, 4) wykonuje się natychmiast na Call Stacku. Następnie kolejka mikro-zadań Microtasks wykonuje Promise (3), a na końcu makro-zadanie z setTimeout (2).",
    },
  },
  {
    id: "dom-storage-events",
    module: 4,
    moduleName: "DOM & Web APIs",
    title: "Zarządzanie DOM, Propagacja Zdarzeń & Web Storage",
    shortDesc: "Interakcja z przeglądarką: delegacja zdarzeń (Event Delegation), optymalizacje wydajnościowe oraz persystencja danych w LocalStorage i SessionStorage.",
    level: "Średniozaawansowany",
    duration: "9 min",
    iconName: "Cpu",
    source: {
      name: "MDN Web Docs — Web APIs & DOM",
      url: "https://developer.mozilla.org/pl/docs/Web/API/Document_Object_Model",
      badge: "W3C / WHATWG DOM",
    },
    theory: [
      "Drzewo DOM (Document Object Model) reprezentuje strukturę dokumentu HTML w pamięci przeglądarki. Nowoczesny JS manipuluje nim za pomocą metod 'querySelector' i 'querySelectorAll'.",
      "Zdarzenia w przeglądarce propagują się w dwóch fazach: przechwytywania (capturing) i bąbelkowania (bubbling). Wzorzec Event Delegation pozwala obsłużyć setki elementów potomnych jednym nasłuchiwaczem na rodzicu.",
      "Web Storage API (localStorage i sessionStorage) pozwala przechowywać ciągi znaków (stringi JSON) o wielkości do ~5-10MB na origin, co jest kluczowe dla zapamiętywania preferencji motywu, koszyków i tokenów sesji.",
    ],
    keyPoints: [
      "Używaj event delegation (np. nasłuchiwanie na liście ul zamiast na każdym li), aby zaoszczędzić pamięć RAM.",
      "Metoda event.stopPropagation() zatrzymuje bąbelkowanie zdarzenia w górę drzewa DOM.",
      "localStorage jest synchroniczne i trwałe po zamknięciu przeglądarki; sessionStorage czyści się po zamknięciu karty.",
      "Zawsze serializuj obiekty za pomocą JSON.stringify() przed zapisem do Storage i deserializuj przez JSON.parse().",
    ],
    codeSnippet: `// 1. Bezpieczny pomocnik do obsługi LocalStorage
class LocalStore {
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Storage quota exceeded or private mode", e);
    }
  }

  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

// 2. Event Delegation na liście elementów
const listContainer = document.querySelector("#project-list");
if (listContainer) {
  listContainer.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const itemId = button.dataset.id;
    console.log(\`Akcja: \${action} dla elementu ID: \${itemId}\`);
  });
}`,
    codeExplanation: "Praktyczna klasa wrapper dla LocalStorage z obsługą błędów JSON i Private Browsing oraz wzorzec delegacji zdarzeń przy użyciu element.closest().",
    quiz: {
      question: "Dlaczego delegacja zdarzeń (Event Delegation) jest rekomendowana przy dynamicznie generowanych elementach listy?",
      options: [
        "Ponieważ dynamicznie dodawane elementy automatycznie dziedziczą obsługę bez konieczności ponownego podpinania addEventListener.",
        "Ponieważ przyspiesza parsowanie CSS.",
        "Ponieważ wyłącza domyślne bąbelkowanie zdarzeń w przeglądarce.",
        "Ponieważ zmniejsza rozmiar kodu HTML o 50%.",
      ],
      correctIndex: 0,
      explanation: "Dzięki bąbelkowaniu zdarzeń do rodzica, nowo dodane elementy potomne są natychmiast obsługiwane przez istniejący nasłuchiwacz, redukując narzut pamięciowy.",
    },
  },
  {
    id: "closures-and-typescript",
    module: 5,
    moduleName: "Zaawansowane Wzorce & TS",
    title: "Domknięcia (Closures), Currying & Wstęp do TypeScript",
    shortDesc: "Zrozumienie hermetyzacji stanu poprzez Closures, programowanie wyższego rzędu (HOF) oraz statyczne typowanie w TypeScript dla bezbłędnej architektury.",
    level: "Zaawansowany",
    duration: "11 min",
    iconName: "ShieldCheck",
    source: {
      name: "TypeScript Official Handbook",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
      badge: "TypeScript Docs",
    },
    theory: [
      "Domknięcie (Closure) to mechanizm, w którym funkcja wewnętrzna zachowuje dostęp do zmiennych ze swojego zewnętrznego zakresu leksykalnego nawet po zakończeniu działania funkcji zewnętrznej.",
      "Closures są fundamentem tworzenia prywatnych stanów, funkcji fabrycznych (factory functions), memoizacji oraz hooków w React (np. useState, useEffect).",
      "TypeScript rozszerza JavaScript o system statycznego typowania w fazie kompilacji, wychwytując błędy logiczne i typograficzne przed uruchomieniem kodu na produkcji.",
    ],
    keyPoints: [
      "Funkcja pamięta środowisko, w którym została zdefiniowana, a nie w którym została wywołana.",
      "Currying przekształca funkcję przyjmującą wiele argumentów w ciąg funkcji przyjmujących po jednym argumencie.",
      "TypeScript w trybie 'strict: true' zapobiega błędom 'cannot read property of undefined'.",
      "Używaj 'interface' do definicji kształtu obiektów i 'type' dla unii typów (Union Types).",
    ],
    codeSnippet: `// 1. Domknięcie (Closure) tworzące prywatny licznik
function createRateLimiter(maxCallsPerMinute) {
  let callCount = 0;
  let lastReset = Date.now();

  return function executeRequest(url) {
    const now = Date.now();
    if (now - lastReset > 60000) {
      callCount = 0;
      lastReset = now;
    }

    if (callCount >= maxCallsPerMinute) {
      throw new Error(\`Rate limit exceeded: Max \${maxCallsPerMinute} req/min\`);
    }

    callCount++;
    return \`[HTTP OK] Zapytanie do \${url} (Wykonań: \${callCount}/\${maxCallsPerMinute})\`;
  };
}

// 2. TypeScript Interface & Type Guard
interface UserProfile {
  id: string;
  email: string;
  role: "admin" | "developer" | "viewer";
}

const limiter = createRateLimiter(5);
console.log(limiter("/api/metrics"));
console.log(limiter("/api/projects"));`,
    codeExplanation: "Przykład prywatnego stanu w domknięciu (Rate Limiter) oraz definicja typów w TypeScript.",
    quiz: {
      question: "Co definiuje pojęcie 'Closure' (domknięcie) w języku JavaScript?",
      options: [
        "Kombinacja funkcji i środowiska leksykalnego, w którym ta funkcja została zadeklarowana.",
        "Sposób natychmiastowego zamykania połączenia sieciowego w WebSocket.",
        "Metoda do kasowania nieużywanych zmiennych z pamięci Garbage Collector.",
        "Blok try/finally zamykający wątek roboczy Web Worker.",
      ],
      correctIndex: 0,
      explanation: "Domknięcie daje funkcji wewnętrznej dostęp do zasięgu funkcji zewnętrznej, pamiętając jej zmienne przez cały czas życia referencji.",
    },
  },
];
